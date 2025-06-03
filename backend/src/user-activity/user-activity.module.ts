import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserActivity } from "./entity/user-activity.entity";
import { User } from "src/user/entity/user.entity";
import { Activity } from "src/activity/entity/activity.entity";
import { UserActivityService } from "./user-activity.service";
import { UserActivityController } from "./user-activity.controller";
import { Ranking } from "src/ranking/entity/ranking.entity";
import { Season } from "src/season/entity/season.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserActivity, User, Activity, Ranking, Season])],
    providers: [UserActivityService],
    controllers: [UserActivityController],
    exports: [UserActivityService],
})
export class UserActivityModule {}
