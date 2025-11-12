import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class EvaluationResponseDTO {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  id: string;

  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  submissionId: string;

  @ApiProperty({ example: "jury-123" })
  @IsString()
  juryId: string;

  @ApiProperty({ example: 18.5 })
  @IsNumber()
  grade: number;

  @ApiPropertyOptional({ example: "Excellent travail, très bien structuré" })
  @IsString()
  @IsOptional()
  comment?: string | null;

  @ApiPropertyOptional({ example: "evaluation-jury-123.pdf" })
  @IsString()
  @IsOptional()
  evaluationFilePath?: string | null;

  @ApiProperty({ type: Date, format: "date-time" })
  @IsDate()
  createdAt: Date;
}