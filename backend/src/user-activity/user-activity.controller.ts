import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserActivityService } from "./user-activity.service";
import { RegisterUserActivityDto } from "./dto/register-user-activity.dto";
import { AuthGuard } from "@nestjs/passport";
import AuthenticatedRequest from "./type/authenticated-request.type";

@Controller("user-activity")
export class UserActivityController {
    constructor(private readonly userActivityService: UserActivityService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post()
    async register(@Req() req: AuthenticatedRequest, @Body() dto: RegisterUserActivityDto) {
        return this.userActivityService.registerUserActivity(req.user.id, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get()
    async findMyActivities(@Req() req: { user: { id: string } }) {
        return this.userActivityService.findByUserId(req.user.id);
    }
}
