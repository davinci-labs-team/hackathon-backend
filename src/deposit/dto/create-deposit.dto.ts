import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateDepositDto {
  @ApiProperty({
    description: "Identifier of the team making the deposit",
    example: "00000000-0000-0000-0000-000000000000",
  })
  @IsUUID()
  teamId: string;
}
