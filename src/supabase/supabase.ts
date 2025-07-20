import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { ExtractJwt } from "passport-jwt";

@Injectable({ scope: Scope.REQUEST })
export class Supabase {
  private readonly logger = new Logger(Supabase.name);
  private clientInstance: SupabaseClient;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService
  ) {}

  getClient() {
    this.logger.log("getting supabase client...");
    if (this.clientInstance) {
      this.logger.log("client exists - returning for current Scope.REQUEST");
      return this.clientInstance;
    }

    this.logger.log("initialising new supabase client for new Scope.REQUEST");

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this.request);

    this.clientInstance = createClient(
      this.configService.get("SUPABASE_URL")!,
      this.configService.get("SUPABASE_KEY")!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
    this.logger.log("auth has been set!");

    return this.clientInstance;
  }
}
