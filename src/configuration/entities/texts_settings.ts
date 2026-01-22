import { IsString, IsOptional } from "class-validator";

export class TextsSettings {
  @IsString()
  hackathonName: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsString()
  hackathonDescription: string;

  @IsString()
  location: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
