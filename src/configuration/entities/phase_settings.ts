import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export class Phase {
  @IsNumber()
  order: number;

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
