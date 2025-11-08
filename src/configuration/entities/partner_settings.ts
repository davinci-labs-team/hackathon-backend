import { IsArray, ValidateNested, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class Partner {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  logoId: string;

  @IsString()
  websiteUrl: string;

  @IsBoolean()
  isParticipatingSchool: boolean;
}

export class PartnersSettings {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Partner)
  partners: Partner[];
}
