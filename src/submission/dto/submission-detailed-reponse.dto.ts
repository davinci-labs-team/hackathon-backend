import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SubmissionStatus } from "@prisma/client";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNotEmpty,
  IsDate,
  IsArray,
  ValidateNested,
  IsNumber,
} from "class-validator";
import { EvaluationResponseDTO } from "./evaluation-response.dto";
import { CommentResponseDTO } from "./comment-response.dto";
import { Type } from "class-transformer";

export class SubmissionDetailedResponseDto {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  id: string;

  @ApiProperty({ example: "team-123" })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiPropertyOptional({
    example: 17.5,
    description: "Moyenne des notes des jurys",
  })
  @IsNumber()
  @IsOptional()
  grade?: number | null;

  @ApiProperty({
    enum: SubmissionStatus,
    example: SubmissionStatus.NOT_SUBMITTED,
  })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @ApiProperty({ type: Date, format: "date-time" })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: Date, format: "date-time" })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiPropertyOptional({ example: "team-123-documents.zip" })
  @IsString()
  @IsOptional()
  submissionFilePath?: string | null;

  @ApiPropertyOptional({ example: "https://github.com/username/repository" })
  @IsString()
  @IsOptional()
  githubLink?: string | null;

  @ApiPropertyOptional({ type: [EvaluationResponseDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluationResponseDTO)
  @IsOptional()
  evaluations?: EvaluationResponseDTO[] | null;

  @ApiPropertyOptional({ type: [CommentResponseDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentResponseDTO)
  @IsOptional()
  comments?: CommentResponseDTO[] | null;
}
