import { Module } from "@nestjs/common";
import { UserModule } from './user/user.module';
import { SupabaseModule } from "./supabase";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    UserModule, SupabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
