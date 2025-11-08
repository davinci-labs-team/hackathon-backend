import { Module } from "@nestjs/common";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { MatchmakingService } from "./matchmaking.service";

@Module({
  controllers: [TeamController],
  providers: [TeamService, MatchmakingService],
})
export class TeamModule {}
