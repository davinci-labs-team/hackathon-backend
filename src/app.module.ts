import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { SupabaseModule } from "./supabase";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    UserModule,
    SupabaseModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
