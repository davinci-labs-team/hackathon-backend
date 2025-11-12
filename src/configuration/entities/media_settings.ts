import { IsString, IsOptional } from "class-validator";

export class MediaSettings {
  @IsOptional()
  @IsString()
  bannerPictureId: string | null;

  @IsOptional()
  @IsString()
  hackathonLogoId: string | null;

  @IsOptional()
  @IsString()
  evaluationGridId: string | null;

  @IsOptional()
  @IsString()
  instagram: string | null;

  @IsOptional()
  @IsString()
  linkedin: string | null;

  @IsOptional()
  @IsString()
  facebook: string | null;

  @IsOptional()
  @IsString()
  x: string | null;

  @IsOptional()
  @IsString()
  youtube: string | null;
}
