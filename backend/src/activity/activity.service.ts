import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Activity } from "./entity/activity.entity";
import { CreateActivityDto } from "./dto/create-activity.dto";

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity)
        private activityRepo: Repository<Activity>,
    ) {}

    async createActivity(dto: CreateActivityDto): Promise<Activity> {
        const activity = this.activityRepo.create(dto);
        return this.activityRepo.save(activity);
    }
}
