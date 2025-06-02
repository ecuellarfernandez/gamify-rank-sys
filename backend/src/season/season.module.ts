import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Season } from "./entity/season.entity";
import { SeasonService } from "./season.service";
import { SeasonController } from "./season.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Season])],
    providers: [SeasonService],
    controllers: [SeasonController],
    exports: [SeasonService],
})
export class SeasonModule {}
