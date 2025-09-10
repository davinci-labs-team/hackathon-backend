import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { SupabaseGuard, SupabaseModule } from "./supabase";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { APP_GUARD } from "@nestjs/core";
import { FaqModule } from './faq/faq.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    UserModule,
    SupabaseModule,
    PrismaModule,
    FaqModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
})
export class AppModule {}
