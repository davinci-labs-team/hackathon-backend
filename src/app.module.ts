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
import { AuthModule } from './auth/auth.module';
import { DepositController } from './deposit/deposit.controller';
import { DepositModule } from './deposit/deposit.module';

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
    DepositModule,
  ],
  controllers: [ExternalModuleController, DepositController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
})
export class AppModule {}
