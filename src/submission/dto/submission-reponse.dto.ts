import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubmissionStatus } from '@prisma/client';
import {
    IsArray,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    IsNotEmpty,
    IsDate,
} from 'class-validator';

export class submissionReponseDto {
    @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'team-123' })
    @IsString()
    @IsNotEmpty()
    teamId: string;

    @ApiPropertyOptional({ type: Number })
    @IsInt()
    grade?: number | null;

    @ApiProperty({ enum: SubmissionStatus, example: SubmissionStatus.NOT_SUBMITTED })
    @IsEnum(SubmissionStatus)
    status: SubmissionStatus;

    @ApiPropertyOptional({ type: Date, format: 'date-time' })
    @IsDate()
    @IsOptional()
    createdAt?: Date | null;

    @ApiPropertyOptional({ type: Date, format: 'date-time' })
    @IsDate()
    @IsOptional()
    updatedAt?: Date | null;

    @ApiProperty({ example: 'team-123-documents.pdf' })
    @IsString()
    submissionFilePath?: string | null;
}