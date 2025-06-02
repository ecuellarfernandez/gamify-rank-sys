import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { RankingService } from "./ranking.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("ranking")
export class RankingController {
    constructor(private readonly rankingService: RankingService) {}

    @UseGuards(AuthGuard("jwt"))
    @Get("season/:seasonId")
    async getRankingBySeason(@Param("seasonId") seasonId: string) {
        return this.rankingService.getRankingBySeason(seasonId);
    }

    // Opcional: ranking de la temporada actual
    @UseGuards(AuthGuard("jwt"))
    @Get("current")
    async getCurrentSeasonRanking() {
        return this.rankingService.getCurrentSeasonRanking();
    }
}
