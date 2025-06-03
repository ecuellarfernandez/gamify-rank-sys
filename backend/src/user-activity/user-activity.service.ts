import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserActivity } from "./entity/user-activity.entity";
import { User } from "src/user/entity/user.entity";
import { Activity } from "src/activity/entity/activity.entity";
import { RegisterUserActivityDto } from "./dto/register-user-activity.dto";
import { Ranking } from "src/ranking/entity/ranking.entity";
import { Season } from "src/season/entity/season.entity";

@Injectable()
export class UserActivityService {
    constructor(
        @InjectRepository(UserActivity)
        private userActivityRepo: Repository<UserActivity>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Activity)
        private activityRepo: Repository<Activity>,
        @InjectRepository(Ranking)
        private rankingRepo: Repository<Ranking>,
        @InjectRepository(Season)
        private seasonRepo: Repository<Season>,
    ) {}

    async getCurrentSeason(): Promise<Season> {
        const season = await this.seasonRepo.findOne({
            order: { start_date: "DESC" },
        });
        console.log("Temporada activa (última creada):", season);
        if (!season) throw new NotFoundException("No seasons found");
        return season;
    }

    async registerUserActivity(userId: string, dto: RegisterUserActivityDto): Promise<UserActivity> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found");

        const activity = await this.activityRepo.findOne({ where: { id: dto.activityId } });
        if (!activity) throw new NotFoundException("Activity not found");

        // Si ya está completada, no permitir completarla de nuevo
        if (activity.completed) {
            throw new NotFoundException("Activity already completed by another user");
        }

        // Marcar como completada globalmente
        activity.completed = true;
        await this.activityRepo.save(activity);

        // Registrar la actividad como completada por el usuario
        const userActivity = this.userActivityRepo.create({
            user,
            activity,
            completedAt: new Date(),
        });
        await this.userActivityRepo.save(userActivity);

        // Sumar puntos al ranking de la temporada actual
        const currentSeason = await this.getCurrentSeason();
        let ranking = await this.rankingRepo.findOne({
            where: { user: { id: user.id }, season: { id: currentSeason.id } },
        });
        if (!ranking) {
            ranking = this.rankingRepo.create({
                user,
                season: currentSeason,
                total_points: 0,
            });
        }
        ranking.total_points += activity.points;
        await this.rankingRepo.save(ranking);

        return userActivity;
    }

    async findByUserId(userId: string) {
        return this.userActivityRepo.find({
            where: { user: { id: userId } },
            relations: ["activity"],
            order: { completedAt: "DESC" },
        });
    }
}
