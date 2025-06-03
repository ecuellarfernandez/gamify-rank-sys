import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Raw } from "typeorm";
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
        const now = new Date();
        const season = await this.seasonRepo.findOne({
            where: {
                start_date: Raw((alias) => `${alias} <= :now`, { now }),
                end_date: Raw((alias) => `${alias} >= :now`, { now }),
            },
            order: { start_date: "DESC" },
        });
        if (!season) throw new NotFoundException("No active season found");
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

        // --- SUMAR PUNTOS AL RANKING DEL USUARIO ---
        // Busca el ranking de la temporada actual (ajusta según tu lógica de temporada)
        const currentSeason = await this.getCurrentSeason(); // Implementa este método según tu modelo
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

        // -------------------------------------------

        const userActivity = this.userActivityRepo.create({
            user,
            activity,
        });
        return this.userActivityRepo.save(userActivity);
    }

    async findByUserId(userId: string) {
        return this.userActivityRepo.find({
            where: { user: { id: userId } },
            relations: ["activity"],
            order: { completedAt: "DESC" },
        });
    }
}
