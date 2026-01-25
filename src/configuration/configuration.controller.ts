import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { CreateConfigurationDTO } from "./dto/create-configuration.dto";
import { UpdateConfigurationDTO } from "./dto/update-configuration.dto";
import { SupabaseUser } from "../common/decorators/supabase-user.decorator";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { HackathonConfigKey } from "@prisma/client";
import { Public } from "src/common/decorators/public.decorator";
import { ConfigurationResponse } from "./dto/configuration-response";
import { PublicConfigurationKey } from "./enums/configuration-key.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("configuration")
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  @Roles(Role.ORGANIZER)
  async create(
    @Body() newConfigurationData: CreateConfigurationDTO,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    return this.configurationService.create(
      newConfigurationData,
      supabaseUser.sub,
    );
  }

  @Patch(":key")
  @Roles(Role.ORGANIZER)
  async update(
    @Param("key") key: HackathonConfigKey,
    @Body() updateConfigurationData: UpdateConfigurationDTO,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    return this.configurationService.update(
      key,
      updateConfigurationData,
      supabaseUser.sub,
    );
  }

  @Get(":key")
  async findOne(@Param("key") key: HackathonConfigKey) {
    return this.configurationService.findOne(key);
  }

  @Patch("/phase/skip")
  @Roles(Role.ORGANIZER)
  async skipPhase(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return this.configurationService.skipPhase(supabaseUser.sub);
  }

  @Patch("/phase/begin")
  @Roles(Role.ORGANIZER)
  async beginNextPhase(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return this.configurationService.beginNextPhase(supabaseUser.sub);
  }

  @Patch("/phase/complete")
  @Roles(Role.ORGANIZER)
  async completeCurrentPhase(
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    return this.configurationService.completeCurrentPhase(supabaseUser.sub);
  }

  @Post("/phases/reset")
  @Roles(Role.ORGANIZER)
  async resetPhases(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
    return this.configurationService.resetPhases(supabaseUser.sub);
  }

  @Public()
  @Get("/:key/public")
  async findOnePublic(
    @Param("key") key: PublicConfigurationKey,
  ): Promise<ConfigurationResponse> {
    return this.configurationService.findOnePublic(key);
  }
}
