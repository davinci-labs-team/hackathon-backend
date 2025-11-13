import { Global, Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { MailgunModule } from "nestjs-mailgun";

@Global()
@Module({
  imports: [
    MailgunModule.forRoot({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
