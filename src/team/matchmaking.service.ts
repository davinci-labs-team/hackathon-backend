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

  async loadMatchmakingSettings(): Promise<void> {
    const config = await this.prisma.hackathonConfig.findUnique({
      // TODO: Use enum for keys
      where: { key: "MATCHMAKING" },
    });

    if (config) {
      this.matchmakingRules = config.value as MatchmakingSettings;
    } else {
      this.matchmakingRules = new MatchmakingSettings(false, 0, 0, []);
    }
  }
}
