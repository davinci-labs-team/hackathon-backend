import { IsArray, ValidateNested, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class Translation {
  @IsString()
  en: string;

  @IsString()
  fr: string;
}

export class Section {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => Translation)
  title: Translation;

  @ValidateNested()
  @Type(() => Translation)
  content: Translation;

  @IsBoolean()
  isDefault: boolean;
}

export class LegalSettings {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Section)
  privacy: Section[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Section)
  terms: Section[];
}
