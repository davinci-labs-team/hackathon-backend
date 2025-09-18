import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { SupabaseGuard, SupabaseModule } from "./supabase";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { APP_GUARD } from "@nestjs/core";
import { S3BucketModule } from "./s3-bucket/s3-bucket.module";
import { ModuleExterneController } from "./module-externe/module-externe.controller";

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
  ],
  controllers: [ModuleExterneController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
})
export class AppModule {}
