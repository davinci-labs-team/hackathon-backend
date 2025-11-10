import { IsString, IsOptional } from "class-validator";

export class TextsSettings {
  @IsString()
  hackathonName: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsString()
  hackathonDescription: string;

  @IsOptional()
  @IsString()
  location?: string;
}
