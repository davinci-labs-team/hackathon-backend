import { IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class EmailTemplate {
  @IsString()
  object: string;

  @IsString()
  title: string;

  @IsString()
  introParagraph: string;

  @IsString()
  actionPrompt: string;

  @IsString()
  buttonText: string;

  @IsString()
  closingNote: string;

  @IsString()
  signatureSalutation: string;

  @IsString()
  signatureName: string;
}

export class MailingSettings {
  @ValidateNested()
  @Type(() => EmailTemplate)
  firstConnectionTemplate: EmailTemplate;

  @ValidateNested()
  @Type(() => EmailTemplate)
  passwordResetTemplate: EmailTemplate;
}
