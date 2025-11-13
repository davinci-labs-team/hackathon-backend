import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { S3BucketService } from "./s3-bucket.service";
import { Public } from "../common/decorators/public.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FileResponseDto } from "./dto/file-response.dto";
import { UploadResponseDto } from "./dto/upload-response.dto";
import { FileUploadDto } from "./dto/file-upload.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SupabaseUser } from "src/common/decorators/supabase-user.decorator";
import { SupabaseDecodedUser } from "src/common/decorators/supabase-decoded-user.types";
import { Role } from "@prisma/client";

@Controller("s3-bucket")
export class S3BucketController {
  constructor(
    private readonly s3BucketService: S3BucketService,
    private readonly prisma: PrismaService,
  ) {}

  @Get("download/:bucketName/:filePath")
  async getFileUrl(
    @Param("bucketName") bucketName: string,
    @Param("filePath") filePath: string,
  ): Promise<FileResponseDto> {
    const url = await this.s3BucketService.getFileUrl(bucketName, filePath);
    return { url };
  }

  @Public()
  @Get("download/public/:bucketName/:filePath")
  async getFileUrlPublic(@Param("bucketName") bucketName: string, @Param("filePath") filePath: string): Promise<FileResponseDto> {
    const url = await this.s3BucketService.getFileUrlPublic(bucketName, filePath);
    return { url };
  }

  @Post("upload/:bucketName")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: FileUploadDto })
  async uploadFile(
    @Param("bucketName") bucketName: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    const path = await this.s3BucketService.uploadFile(bucketName, file);
    return { path };
  }

  @Delete("delete/:bucketName/:filePath")
  async deleteFile(
    @Param("bucketName") bucketName: string,
    @Param("filePath") filePath: string,
    @SupabaseUser() supabaseUser: SupabaseDecodedUser
  ): Promise<{ message: string }> {
    // check if user exists and have ORGANIZER role
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.sub },
    });

    if (!user || user.role !== Role.ORGANIZER) {
      throw new Error("Only ORGANIZER users can delete files");
    }

    await this.s3BucketService.deleteFile(bucketName, filePath);
    return { message: "File deleted successfully" };
  }
}
