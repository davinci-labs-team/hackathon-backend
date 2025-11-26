import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { SupabaseGuard, SupabaseModule } from "./supabase";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { APP_GUARD } from "@nestjs/core";
import { S3BucketModule } from "./s3-bucket/s3-bucket.module";
import { ExternalModuleController } from "./external-module/external-module.controller";
import { AnnouncementModule } from "./announcement/announcement.module";
import { FaqModule } from "./faq/faq.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { AuthModule } from "./auth/auth.module";
import { SubmissionModule } from "./submission/submission.module";
import { TeamModule } from "./team/team.module";
import { GithubModule } from "./github/github.module";
import { MailerModule } from "./mailer/mailer.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    UserModule,
    SupabaseModule,
    PrismaModule,
    S3BucketModule,
    AnnouncementModule,
    FaqModule,
    ConfigurationModule,
    AuthModule,
    SubmissionModule,
    TeamModule,
    GithubModule,
    MailerModule,
  ],
  controllers: [ExternalModuleController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
})
export class AppModule {}
