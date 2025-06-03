import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Season } from "./entity/season.entity";
import { SeasonService } from "./season.service";
import { SeasonController } from "./season.controller";
import { User } from "src/user/entity/user.entity";
import { Ranking } from "src/ranking/entity/ranking.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Season, Ranking, User])],
    providers: [SeasonService],
    controllers: [SeasonController],
    exports: [SeasonService],
})
export class SeasonModule {}
