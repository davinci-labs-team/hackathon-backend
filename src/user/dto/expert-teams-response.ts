import { ApiProperty } from "@nestjs/swagger";
import { TeamResponse } from "src/team/dto/team-response";

export class ExpertTeamsResponse {
  @ApiProperty({
    description: "List of teams the jury is part of",
    type: [TeamResponse],
  })
  juryTeams: TeamResponse[];

  @ApiProperty({
    description: "List of teams the mentor is part of",
    type: [TeamResponse],
  })
  mentorTeams: TeamResponse[];
}
