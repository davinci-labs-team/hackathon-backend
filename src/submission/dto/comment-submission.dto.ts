import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CommentSubmissionDto {
  @ApiProperty({
    description: "The ID of the submission to evaluate",
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  })
  @IsUUID()
  submissionId: string;

  @ApiProperty({
    description: "Feedback provided after evaluating the submission",
    example: "Great job on the project!",
  })
  @IsString()
  content: string;
}
