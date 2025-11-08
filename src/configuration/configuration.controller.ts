import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { CreateConfigurationDTO } from "./dto/create-configuration.dto";
import { UpdateConfigurationDTO } from "./dto/update-configuration.dto";
import { SupabaseUser } from "../common/decorators/supabase-user.decorator";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { HackathonConfigKey } from "@prisma/client";

@Controller("configuration")
export class ConfigurationController {
  constructor(private readonly settingsService: ConfigurationService) {}

  @Post()
  async create(
    @Body() newConfigurationData: CreateConfigurationDTO,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser
  ) {
    return this.settingsService.create(newConfigurationData, supabaseUser.sub);
  }

  @Patch(":key")
  async update(
    @Param("key") key: HackathonConfigKey,
    @Body() updateConfigurationData: UpdateConfigurationDTO,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser
  ) {
    return this.settingsService.update(key, updateConfigurationData, supabaseUser.sub);
  }

  @Get(":key")
  async findOne(@Param("key") key: HackathonConfigKey) {
    return this.settingsService.findOne(key);
  }
}
