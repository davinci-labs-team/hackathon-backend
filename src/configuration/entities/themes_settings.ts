import { IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class Subject {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class Theme {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Subject)
  subjects: Subject[];
}

export class ThemesSettings {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Theme)
  themes: Theme[];
}
