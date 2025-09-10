import { Controller, Get, Post, Body, Patch, Param, Query } from "@nestjs/common";
import { SettingsService } from './settings.service';
import { CreateSettingDTO } from "./dto/create-settings.dto";
import { UpdateSettingDTO } from "./dto/update-settings.dto";

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Post()
    async create(@Body() createSettingDto: CreateSettingDTO, @Param('supabaseUserId') supabaseUserId: string) {
        return this.settingsService.create(createSettingDto, supabaseUserId);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDTO, @Param('supabaseUserId') supabaseUserId: string) {
        return this.settingsService.update(id, updateSettingDto, supabaseUserId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('key') key?: string) {
        return this.settingsService.findOne(id, key);
    }
}
