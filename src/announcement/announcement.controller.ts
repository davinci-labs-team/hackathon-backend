import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AnnouncementService } from "./announcement.service";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { SupabaseUser } from "../common/decorators/supabase-user.decorator";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { Announcement, Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { VisibilityTypeRequest } from "./dto/visibility-type-request.dto";
import { VisibilityType } from "./enums/visibility-type.enum";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("announcements")
@Controller("announcement")
export class AnnouncementController {
  constructor(
    private readonly announcementService: AnnouncementService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(
    @Body()
    createAnnouncementDto: CreateAnnouncementDto,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    // check if user exists and have ORGANIZER role
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.sub },
    });

    if (!user || user.role !== Role.ORGANIZER) {
      throw new Error("Only ORGANIZER users can create announcements");
    }

    return this.announcementService.create(createAnnouncementDto, user);
  }

  @Get()
  async getAll(@Query() query: VisibilityTypeRequest): Promise<Announcement[]> {
    return this.announcementService.getAll(
      query.visibilityType || VisibilityType.BOTH,
    );
  }

  @Get("public")
  @Public()
  async getAllPublic(): Promise<Announcement[]> {
    return this.announcementService.getAll(VisibilityType.PUBLIC);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<Announcement | null> {
    return this.announcementService.getById(id);
  }

  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ): Promise<void> {
    // check if user exists and have ORGANIZER role
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.sub },
    });

    if (!user || user.role !== Role.ORGANIZER) {
      throw new Error("Only ORGANIZER users can delete announcements");
    }

    return this.announcementService.delete(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body()
    updateAnnouncementDto: UpdateAnnouncementDto,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
  ) {
    // check if user exists and have ORGANIZER role
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.sub },
    });

    if (!user || user.role !== Role.ORGANIZER) {
      throw new Error("Only ORGANIZER users can update announcements");
    }

    return this.announcementService.update(id, updateAnnouncementDto, user);
  }
}
