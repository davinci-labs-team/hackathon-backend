import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateConfigurationDTO } from "./dto/update-configuration.dto";
import { CreateConfigurationDTO } from "./dto/create-configuration.dto";
import { ConfigurationResponse } from "./dto/configuration-response";
import { Role, HackathonConfigKey } from "@prisma/client";
import { PhaseSettings } from "./entities/phase_settings";
import { LegalSettings } from "./entities/legal_settings";
import { TextsSettings } from "./entities/texts_settings";
import { MediaSettings } from "./entities/media_settings";
import { ThemesSettings } from "./entities/themes_settings";
import { PartnersSettings } from "./entities/partner_settings";
import { MatchmakingSettings } from "./entities/matchmaking_settings";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { MailSettings } from "./entities/mail_settings";
import { PublicConfigurationKey } from "./enums/configuration-key.enum";

type ConfigSchemaClass<T = unknown> = new (...args: any[]) => T;

@Injectable()
export class ConfigurationService {
  private configSchemas: Record<HackathonConfigKey, ConfigSchemaClass> = {
    PHASES: PhaseSettings,
    LEGAL: LegalSettings,
    TEXTS: TextsSettings,
    MEDIA: MediaSettings,
    THEMES: ThemesSettings,
    PARTNERS: PartnersSettings,
    MATCHMAKING: MatchmakingSettings,
    MAILING: MailSettings,
  };

  constructor(private readonly prisma: PrismaService) {}

  private async validateConfiguration(
    key: HackathonConfigKey,
    value: unknown,
  ): Promise<void> {
    const schema = this.configSchemas[key];
    if (!schema) {
      throw new BadRequestException(
        `No validation schema defined for key '${key}'`,
      );
    }

    if (Array.isArray(value)) {
      const instances = value.map((item) => plainToInstance(schema, item));
      for (const instance of instances) {
        await validateOrReject(instance as object, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
      }
    } else {
      const instance = plainToInstance(schema, value);
      await validateOrReject(instance as object, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
    }
  }

  async create(
    newConfigurationData: CreateConfigurationDTO,
    supabaseUserId: string,
  ): Promise<ConfigurationResponse> {
    await this.validateUserRole(supabaseUserId);

    const existingConfig = await this.prisma.hackathonConfig.findUnique({
      where: { key: newConfigurationData.key },
    });
    if (existingConfig) {
      throw new Error(
        `Configuration with key '${newConfigurationData.key}' already exists.`,
      );
    }

    await this.validateConfiguration(
      newConfigurationData.key,
      newConfigurationData.value,
    );
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
    supabaseUserId: string,
  ): Promise<ConfigurationResponse> {
    await this.validateUserRole(supabaseUserId);

    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key },
    });
    if (!config)
      throw new NotFoundException(`Configuration with key '${key}' not found`);

    await this.validateConfiguration(key, updateConfigurationData.value);

    return this.prisma.hackathonConfig.update({
      where: { key },
      data: { value: updateConfigurationData.value, updatedAt: new Date() },
    });
  }

  async findOne(key: HackathonConfigKey): Promise<ConfigurationResponse> {
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key },
    });
    if (!config)
      throw new NotFoundException(`Configuration with key '${key}' not found`);
    return config;
  }

  async findOnePublic(key: PublicConfigurationKey): Promise<ConfigurationResponse> {
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key },
    });
    if (!config)
      throw new NotFoundException(`Configuration with key '${key}' not found`);
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
