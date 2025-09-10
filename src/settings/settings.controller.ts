import { Controller, Get, Post, Body, Patch, Param, Query } from "@nestjs/common";
import { SettingsService } from './settings.service';
import { CreateSettingDTO } from "./dto/create-settings.dto";
import { UpdateSettingDTO } from "./dto/update-settings.dto";
import { SupabaseUser } from "src/common/decorators/supabase-user.decorator";
import { SupabaseDecodedUser } from "src/common/decorators/supabase-decoded-user.types";

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Post()
    async create(@Body() createSettingDto: CreateSettingDTO, @SupabaseUser() supabaseUser: SupabaseDecodedUser) {
        return this.settingsService.create(createSettingDto, supabaseUser.sub);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDTO, @SupabaseUser() supabaseUser: SupabaseDecodedUser) {
        return this.settingsService.update(id, updateSettingDto, supabaseUser.sub);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('key') key?: string) {
        return this.settingsService.findOne(id, key);
    }
}
