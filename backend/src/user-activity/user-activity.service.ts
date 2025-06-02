import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserActivity } from "./entity/user-activity.entity";
import { User } from "src/user/entity/user.entity";
import { Activity } from "src/activity/entity/activity.entity";
import { RegisterUserActivityDto } from "./dto/register-user-activity.dto";

@Injectable()
export class UserActivityService {
    constructor(
        @InjectRepository(UserActivity)
        private userActivityRepo: Repository<UserActivity>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Activity)
        private activityRepo: Repository<Activity>,
    ) {}

    async registerUserActivity(userId: string, dto: RegisterUserActivityDto): Promise<UserActivity> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found");

        const activity = await this.activityRepo.findOne({ where: { id: dto.activityId } });
        if (!activity) throw new NotFoundException("Activity not found");

        const userActivity = this.userActivityRepo.create({
            user,
            activity,
        });
        return this.userActivityRepo.save(userActivity);
    }
}
