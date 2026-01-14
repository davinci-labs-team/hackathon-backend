import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { EmailTemplate, MailingSettings } from "../configuration/entities/mail_settings";
import { loadTemplateFile, renderTemplate } from "./template-builder.util";
import { PrismaService } from "../prisma/prisma.service";
import { HackathonConfigKey } from "@prisma/client";

@Injectable()
export class MailerService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly allowedEmails: string[] = process.env.ALLOWED_EMAILS
    ? process.env.ALLOWED_EMAILS.split(",").map(email => email.trim())
    : [];

  constructor(private readonly prisma: PrismaService) { }

  async sendInviteEmail(
    to: string,
    firstLoginUrl: string,
  ) {
    const variables = {
      firstLoginUrl,
    };
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key: HackathonConfigKey.MAILING },
    }).then((conf) => conf?.value as unknown as MailingSettings);

    return await this.sendTemplateEmail(to, "invite-first-login", config.firstConnectionTemplate, variables);
  }

  async sendPasswordResetEmail(
    to: string,
    resetPasswordUrl: string,
  ) {
    const variables = {
      resetPasswordUrl,
    };
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key: HackathonConfigKey.MAILING },
    }).then((conf) => conf?.value as unknown as MailingSettings);

    return await this.sendTemplateEmail(to, "password-reset",config.passwordResetTemplate, variables);
  }


  async sendTemplateEmail(
    to: string,
    templateName: string,
    templateData: EmailTemplate,
    variables: Record<string, any>
  ) {
    if (!this.isEmailAllowed(to)) {
      console.warn(`Email to ${to} blocked by allowed emails configuration.`);
      return;
    }

    // load template file
    const file = loadTemplateFile(templateName);

    // merge template with data and variables
    const html = renderTemplate(file, templateData, variables);

    // send via Resend
    return await this.resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject: templateData.object,
      html,
    });
  }

  private isEmailAllowed(email: string): boolean {
    if (this.allowedEmails.length > 0 && this.allowedEmails[0] === "*") {
      return true; // All emails are allowed
    }
    return this.allowedEmails.includes(email);
  }
}
