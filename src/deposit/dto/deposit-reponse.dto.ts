import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DepositStatus } from '@prisma/client';
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

export class DepositReponseDto {
    @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'team-123' })
    @IsString()
    @IsNotEmpty()
    teamId: string;

    @ApiProperty({ type: [String], example: ['rendu/file1.pdf'] })
    @IsArray()
    @IsString({ each: true })
    files: string[];

    @ApiProperty({ enum: DepositStatus, example: DepositStatus.SUBMITTED })
    @IsEnum(DepositStatus)
    depositStatus: DepositStatus;

    @ApiProperty({ enum: DepositStatus, example: DepositStatus.NOT_EVALUATED })
    @IsEnum(DepositStatus)
    evaluationStatus: DepositStatus;

    @ApiProperty({ type: Date, format: 'date-time' })
    @IsDate()
    dueDate: Date;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    comments?: string | null;

    @ApiPropertyOptional({ type: Date, format: 'date-time' })
    @IsDate()
    @IsOptional()
    submittedAt?: Date | null;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    feedback?: string | null;

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @IsInt()
    grade?: number | null;

    @ApiPropertyOptional({ type: Date, format: 'date-time' })
    @IsOptional()
    @IsDate()
    reviewedAt?: Date | null;
}