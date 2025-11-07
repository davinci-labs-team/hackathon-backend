import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class UpdateSubmissionDto {
  @ApiProperty({
    description: "The ID of the team associated with the submission to evaluate",
    example: "12345",
  })
  @IsUUID()
  teamId: string;

  @ApiProperty({ example: "team-123-documents.pdf" })
  @IsString()
  submissionFilePath?: string | null;
}
