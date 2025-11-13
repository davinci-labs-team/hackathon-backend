import { ForbiddenException, Injectable } from "@nestjs/common";
import { MailgunService } from "nestjs-mailgun";

@Injectable()
export class MailerService {
  private readonly domain = process.env.MAILGUN_DOMAIN || '';

  constructor(private readonly mailgunService: MailgunService) {}

  async sendInviteEmail(to: string, firstName: string, firstLoginUrl: string, hackathonName: string) {
    const subject = `Invitation au Hackathon ${hackathonName}`;
    const variables = {
      firstName,
      firstLoginUrl,
      hackathonName,
      year: new Date().getFullYear(),
    };
    return await this.sendMail(to, subject, 'invite-first-login', variables);
  }

  async sendPasswordResetEmail(to: string, firstName: string, resetPasswordUrl: string) {
    const subject = `Réinitialisation de votre mot de passe`;
    const variables = {
      firstName,
      resetPasswordUrl,
      year: new Date().getFullYear(),
    };
    return await this.sendMail(to, subject, 'password-reset', variables);
  }

  async sendMail(to: string, subject: string, template: string, variables: Record<string, any>) {
    const data = {
      from: 'Hackathon Team <' + process.env.MAILGUN_FROM + '>',
      to,
      subject,
      template,
      'h:X-Mailgun-Variables': JSON.stringify(variables),
    };
    try {
      const response = await this.mailgunService.createEmail(this.domain, data);
      console.log('Mail envoyé ✅', response);
      return response;
    } catch (error) {
      console.error('Erreur envoi mail ❌', error);
      throw new ForbiddenException('Failed to send email');
    }
  }
}