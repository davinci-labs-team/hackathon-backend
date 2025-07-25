import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SupabaseStrategy } from "./supabase.strategy";
import { SupabaseGuard } from "./supabase.guard";

@Module({
  imports: [ConfigModule],
  providers: [SupabaseStrategy, SupabaseGuard],
  exports: [SupabaseStrategy, SupabaseGuard],
})
export class SupabaseModule {}
