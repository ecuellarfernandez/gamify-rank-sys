import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { SeasonService } from "./season.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";

@Controller("season")
export class SeasonController {
    constructor(private readonly seasonService: SeasonService) {}

    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("admin")
    @Post()
    async create(@Body() dto: { name: string; start_date: string; end_date: string }) {
        return this.seasonService.create(dto);
    }
}
