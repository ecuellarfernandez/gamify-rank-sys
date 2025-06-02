import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Season } from "./entity/season.entity";

@Injectable()
export class SeasonService {
    constructor(
        @InjectRepository(Season)
        private seasonRepo: Repository<Season>,
    ) {}

    async create(dto: { name: string; start_date: string; end_date: string }) {
        const season = this.seasonRepo.create(dto);
        return this.seasonRepo.save(season);
    }
}
