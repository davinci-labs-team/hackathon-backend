import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateConfigurationDTO } from "./dto/update-configuration.dto";
import { CreateConfigurationDTO } from "./dto/create-configuration.dto";
import { ConfigurationResponse } from "./dto/configuration-response";
import { Role, HackathonConfigKey } from "@prisma/client";

@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    newConfigurationData: CreateConfigurationDTO,
    supabaseUserId: string
  ): Promise<ConfigurationResponse> {
    await this.validateUserRole(supabaseUserId);


    const existingConfig = await this.prisma.hackathonConfig.findUnique({
      where: { key: newConfigurationData.key },
    });
    if (existingConfig) {
      throw new Error(`Configuration with key '${newConfigurationData.key}' already exists.`);
    }

    return this.prisma.hackathonConfig.create({
      data: {
        key: newConfigurationData.key,
        value: newConfigurationData.value,
      },
    });
  }

  async update(
    key: HackathonConfigKey,
    updateConfigurationData: UpdateConfigurationDTO,
    supabaseUserId: string
  ): Promise<ConfigurationResponse> {
    await this.validateUserRole(supabaseUserId);

    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key },
    });
    if (!config) throw new NotFoundException(`Configuration with key '${key}' not found`);

    return this.prisma.hackathonConfig.update({
      where: { key },
      data: { value: updateConfigurationData.value, updatedAt: new Date() },
    });
  }

  async findOne(key: HackathonConfigKey): Promise<ConfigurationResponse> {
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key },
    });
    if (!config) throw new NotFoundException(`Configuration with key '${key}' not found`);
    return config;
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
