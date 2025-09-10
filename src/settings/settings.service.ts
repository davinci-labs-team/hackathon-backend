import {
    Injectable,
    NotFoundException,
    ForbiddenException
} from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDTO } from './dto/update-settings.dto';
import { CreateSettingDTO } from './dto/create-settings.dto';
import { SettingResponse } from './dto/settings-response';
import { Role } from "@prisma/client";
import { JsonObject, JsonType } from "./dto/settings-response";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSettingDto: CreateSettingDTO, supabaseUserId: string): Promise<SettingResponse> {
    await this.validateUserRole(supabaseUserId);

    return this.prisma.setting.create({
      data: {
        key: createSettingDto.key,
        value: createSettingDto.value,
      },
    });
  }

  async update(id: string, dto: UpdateSettingDTO, supabaseUserId: string): Promise<SettingResponse> {
    await this.validateUserRole(supabaseUserId);
  
    const setting = await this.prisma.setting.findUnique({ where: { id } });
    if (!setting) throw new NotFoundException(`Setting ${id} not found`);
    
    if (!dto.key) {
        throw new Error('Key is required to update setting value')
    }
  
    const value = (typeof setting.value === 'object' && !Array.isArray(setting.value))
      ? { ...setting.value, [dto.key]: dto.value }
      : { [dto.key]: dto.value };
  
    return this.prisma.setting.update({
      where: { id },
      data: { value, updatedAt: new Date() },
    });
  }

  
  async findOne(id: string, key?: string): Promise<SettingResponse> {
    const setting = await this.prisma.setting.findUnique({ where: { id } });
    if (!setting) throw new NotFoundException(`Setting with ID ${id} not found`);
  
    let value: any = setting.value;
  
    if (key && setting.value && typeof setting.value === 'object' && !Array.isArray(setting.value)) {
      value = (setting.value as Record<string, any>)[key];
    }
  
    if (key && value === undefined) throw new NotFoundException(`Key '${key}' not found`);
  
    return { ...setting, value };
  }
  

  private async validateUserRole(supabaseUserId: string) {
    const existUser = await this.prisma.user.findUnique({
        where: { supabaseUserId },
    });
    if (!existUser) {
        throw new NotFoundException("User not found.");
    }
    if (existUser?.role !== Role.ORGANIZER) {
        throw new ForbiddenException("Only organizer can create FAQs.");
    }
}
}
