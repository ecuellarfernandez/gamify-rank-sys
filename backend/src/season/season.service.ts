import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Season } from "./entity/season.entity";
import { User } from "../user/entity/user.entity";
import { Ranking } from "../ranking/entity/ranking.entity";

@Injectable()
export class SeasonService {
    constructor(
        @InjectRepository(Season)
        private seasonRepo: Repository<Season>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Ranking)
        private rankingRepo: Repository<Ranking>,
    ) {}

    async create(dto: { name: string; start_date: string; end_date: string }) {
        const season = this.seasonRepo.create(dto);
        await this.seasonRepo.save(season);

        // Crear ranking en 0 para todos los usuarios en la nueva temporada
        const users = await this.userRepo.find();
        for (const user of users) {
            const ranking = this.rankingRepo.create({
                user,
                season,
                total_points: 0,
            });
            try {
                await this.rankingRepo.save(ranking);
            } catch (err) {
                console.error("Error creando ranking para usuario", user.id, err);
                throw err;
            }
        }

        return season;
    }

    async findAll() {
        return this.seasonRepo.find({ order: { start_date: "DESC" } });
    }
}
