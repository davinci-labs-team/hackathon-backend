import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TeamService } from "./team.service";
import { MatchmakingSettings } from "src/configuration/entities/matchmaking_settings";

@Injectable()
export class MatchmakingService {
  private matchmakingRules: MatchmakingSettings;
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamService: TeamService
  ) {}
}
