import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class EvaluateDepositDto {
  @ApiProperty({
    description: "The ID of the team associated with the deposit to evaluate",
    example: "12345",
  })
  @IsUUID()
  teamId: string;

  @ApiProperty({
    description: "Feedback provided after evaluating the deposit",
    example: "Great job on the project!",
  })
  feedback: string;

  @ApiProperty({
    description: "Grade awarded after evaluating the deposit",
    example: 85,
  })
  grade: number;
}
