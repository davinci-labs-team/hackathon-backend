import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class Phase {
  @IsNumber()
  order: number;

  @IsString()
  name: string;

  @IsBoolean()
  optionalPhase: boolean;

  @IsString()
  @IsNotEmpty()
  status: 'NOT_STARTED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}

export class PhaseSettings {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Phase)
  phases: Phase[];
}
