import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class S3BucketService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // not the anon key
  );

  async getFileUrl(bucket: string, key: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(key, 60 * 5); // expires in 5 minutes

    if (error) {
      throw new NotFoundException(
        `Failed to generate signed URL: ${error.message}`,
      );
    }

    return data.signedUrl;
  }

  async getFileUrlPublic(bucket: string, key: string): Promise<string> {
    console.log(bucket, bucket === "public_files")
    if ((bucket === "annonces" && await this.isAnnouncementPublic(key))) {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(key, 60 * 5); // expires in 5 minutes
      if (error) {
        throw new NotFoundException(`Failed to generate signed URL: ${error.message}`);
      }

      return data.signedUrl;
    }
    if (bucket === "public_files") {
      const { data } = await this.supabase.storage.from(bucket).getPublicUrl(key);

      console.log(data.publicUrl)

      return data.publicUrl;
    }
    throw new NotFoundException("File is not public");
  }

  async uploadFile(bucket: string, file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException("No file uploaded");

    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException("File too large (max 50MB)");
    }

    const filePath = `${Date.now()}-${file.originalname}`;

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // replace if the file already exists
      });

    if (error) {
      throw new BadRequestException(`Failed to upload: ${error.message}`);
    }

    return filePath;
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([key]);

    if (error) {
      throw new NotFoundException(`Failed to delete file: ${error.message}`);
    }
  }

  private async isAnnouncementPublic(key: string): Promise<boolean> {
    const announcement = await this.prisma.announcement.findFirst({
      where: { files: { array_contains: [key] }, isPrivate: false },
    });
    return !!announcement;
  }
}
