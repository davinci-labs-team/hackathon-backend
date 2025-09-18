import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { AnnouncementService } from "./announcement.service";
import { SupabaseDecodedUser } from "src/common/decorators/supabase-decoded-user.types";
import { SupabaseUser } from "src/common/decorators/supabase-user.decorator";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";

@ApiTags("announcements")
@Controller("announcement")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

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
    const tags = createAnnouncementDto.tags.split(",").map(tag => tag.trim());

    return this.announcementService.create(
      { ...createAnnouncementDto, tags, files },
      supabaseUser.sub
    );
  }
}
