import { IsString, IsOptional } from "class-validator";

export class MailSettings {
  @IsOptional()
  @IsString()
  invitEmailTemplate: string | null;

  @IsOptional()
  @IsString()
  resetPasswordEmailTemplate: string | null;
}
