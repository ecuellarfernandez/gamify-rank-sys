import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";

@Controller("activity")
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Post()
    async create(@Body() dto: CreateActivityDto) {
        return this.activityService.createActivity(dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get()
    async findAll() {
        return this.activityService.findAll();
    }
}
