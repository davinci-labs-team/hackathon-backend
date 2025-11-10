import {
  IsBoolean,
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class Constraint {
  @IsString()
  rule: "MIN" | "MAX" | "EQUAL";

  @IsArray()
  @IsString({ each: true })
  schools: string[];

  @IsInt()
  value: number;

  @IsBoolean()
  multiple: boolean;
}

export class MatchmakingSettings {
  @IsBoolean()
  isActive: boolean;

  @IsInt()
  teamSizeMin: number;

  @IsInt()
  teamSizeMax: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Constraint)
  constraints: Constraint[];
}
