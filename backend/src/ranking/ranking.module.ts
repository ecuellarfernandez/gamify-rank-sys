import { Module } from "@nestjs/common";
import { RankingService } from "./ranking.service";
import { RankingController } from "./ranking.controller";
import { Ranking } from "./entity/ranking.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Season } from "src/season/entity/season.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Ranking, Season])],
    providers: [RankingService],
    controllers: [RankingController],
    exports: [RankingService],
})
export class RankingModule {}
