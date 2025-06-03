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
        const seasons = await this.seasonRepo.find({
            order: { start_date: "DESC", createdAt: "DESC" },
            take: 1,
        });
        const season = seasons[0];
        console.log("Temporada activa (última creada):", season);
        if (!season) throw new NotFoundException("No seasons found");
        return season;
    }

    async registerUserActivity(userId: string, dto: RegisterUserActivityDto): Promise<UserActivity> {
        try {
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) throw new NotFoundException("User not found");

            const activity = await this.activityRepo.findOne({ where: { id: dto.activityId } });
            if (!activity) throw new NotFoundException("Activity not found");

            const currentSeason = await this.getCurrentSeason();

            // Verifica si el usuario ya completó esta actividad en esta temporada
            const alreadyDone = await this.userActivityRepo.findOne({
                where: {
                    user: { id: user.id },
                    activity: { id: activity.id },
                    season: { id: currentSeason.id },
                },
            });
            if (alreadyDone) {
                throw new NotFoundException("You already completed this activity in this season");
            }

            // Marcar la actividad como completada globalmente
            activity.completed = true;
            await this.activityRepo.save(activity);

            // Registrar la actividad como completada por el usuario y la temporada
            const userActivity = this.userActivityRepo.create({
                user,
                activity,
                season: currentSeason,
                completedAt: new Date(),
            });
            await this.userActivityRepo.save(userActivity);

            // Sumar puntos al ranking de la temporada actual
            let ranking = await this.rankingRepo.findOne({
                where: { user: { id: user.id }, season: { id: currentSeason.id } },
                relations: ["user", "season"],
            });
            if (!ranking) {
                ranking = this.rankingRepo.create({
                    user,
                    season: currentSeason,
                    total_points: 0,
                });
                console.log("[registerUserActivity] Ranking creado:", ranking);
            } else {
                console.log("[registerUserActivity] Ranking encontrado:", ranking);
            }
            ranking.total_points += activity.points;
            await this.rankingRepo.save(ranking);

            return userActivity;
        } catch (error) {
            console.error("[registerUserActivity] Error al registrar actividad:", error);
            throw new NotFoundException("Error registering user activity");
        }
    }

    async findByUserId(userId: string) {
        return this.userActivityRepo.find({
            where: { user: { id: userId } },
            relations: ["activity", "season"],
            order: { completedAt: "DESC" },
        });
    }
}
