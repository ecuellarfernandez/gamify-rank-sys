import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserActivity } from "./entity/user-activity.entity";
import { User } from "src/user/entity/user.entity";
import { Activity } from "src/activity/entity/activity.entity";
import { UserActivityService } from "./user-activity.service";
import { UserActivityController } from "./user-activity.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserActivity, User, Activity])],
    providers: [UserActivityService],
    controllers: [UserActivityController],
    exports: [UserActivityService],
})
export class UserActivityModule {}
