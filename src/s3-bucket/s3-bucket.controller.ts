import {
  Controller,
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

@Controller("s3-bucket")
export class S3BucketController {
  constructor(private readonly s3BucketService: S3BucketService) {}

  @Get("download/:bucketName/:filePath")
  async getFileUrl(@Param("bucketName") bucketName: string, @Param("filePath") filePath: string): Promise<FileResponseDto> {
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
  async uploadFile(@Param("bucketName") bucketName: string, @UploadedFile() file: Express.Multer.File): Promise<UploadResponseDto> {
    const path = await this.s3BucketService.uploadFile(bucketName, file);
    return { path };
  }
}
