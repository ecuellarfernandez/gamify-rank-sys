import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ranking } from "./entity/ranking.entity";
import { Season } from "src/season/entity/season.entity";

@Injectable()
export class RankingService {
    constructor(
        @InjectRepository(Ranking)
        private rankingRepo: Repository<Ranking>,
        @InjectRepository(Season)
        private seasonRepo: Repository<Season>,
    ) {}

    async getRankingBySeason(seasonId: string) {
        const season = await this.seasonRepo.findOne({ where: { id: seasonId } });
        if (!season) throw new NotFoundException("Season not found");

        const rankings = await this.rankingRepo.find({
            where: { season: { id: seasonId } },
            relations: ["user", "season"],
            order: { total_points: "DESC" },
        });

        // Estructura para frontend: agrega posición y solo los datos necesarios
        return rankings.map((ranking, index) => ({
            position: index + 1,
            user: {
                id: ranking.user.id,
                name: ranking.user.name,
                email: ranking.user.email,
            },
            total_points: ranking.total_points,
            season: {
                id: season.id,
                name: season.name,
            },
        }));
    }

    async getCurrentSeasonRanking() {
        const today = new Date();
        const season = await this.seasonRepo.createQueryBuilder("season").where("season.start_date <= :today AND season.end_date >= :today", { today }).getOne();

        if (!season) throw new NotFoundException("No active season");

        const rankings = await this.rankingRepo.find({
            where: { season: { id: season.id } },
            relations: ["user", "season"],
            order: { total_points: "DESC" },
        });

        return rankings.map((ranking, index) => ({
            position: index + 1,
            user: {
                id: ranking.user.id,
                name: ranking.user.name,
                email: ranking.user.email,
            },
            total_points: ranking.total_points,
            season: {
                id: season.id,
                name: season.name,
            },
        }));
    }
}
