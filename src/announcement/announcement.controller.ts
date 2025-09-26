import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { AnnouncementService } from "./announcement.service";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { SupabaseUser } from "../common/decorators/supabase-user.decorator";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { Announcements, Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { PatchAnnouncementDto } from "./dto/patch-announcement.dto";

@ApiTags("announcements")
@Controller("announcement")
export class AnnouncementController {
  constructor(
    private readonly announcementService: AnnouncementService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Create announcement with optional files",
    type: CreateAnnouncementDto,
  })
  @UseInterceptors(FilesInterceptor("files"))
  async create(
    @Body()
    createAnnouncementDto: Omit<CreateAnnouncementDto, "tags" | "files"> & {
      tags: string;
    },
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    // check if user exists and have ORGANIZER role
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.sub },
    });

    if (!user || user.role !== Role.ORGANIZER) {
      throw new Error("Only ORGANIZER users can create announcements");
    }

    // Convert tags from comma-separated string to array
    const tags = createAnnouncementDto.tags.split(",").map(tag => tag.trim());

    return this.announcementService.create({ ...createAnnouncementDto, tags, files }, user);
  }

  @Get()
  async getAll(): Promise<Announcements[]> {
    return this.announcementService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<Announcements | null> {
    return this.announcementService.getById(id);
  }

  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser
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
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Update announcement with optional files",
    type: PatchAnnouncementDto,
  })
  @UseInterceptors(FilesInterceptor("files"))
  async update(
    @Param("id") id: string,
    @Body()
    updateAnnouncementDto: Partial<
      Omit<PatchAnnouncementDto, "tags" | "files"> & {
        tags: string;
      }
    >,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    // check if user exists and have ORGANIZER role
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.sub },
    });

    if (!user || user.role !== Role.ORGANIZER) {
      throw new Error("Only ORGANIZER users can update announcements");
    }

    // Convert tags from comma-separated string to array if provided
    const tags = updateAnnouncementDto.tags
      ? updateAnnouncementDto.tags.split(",").map(tag => tag.trim())
      : undefined;

    return this.announcementService.update(id, { ...updateAnnouncementDto, tags, files }, user);
  }
}
