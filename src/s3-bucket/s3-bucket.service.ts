import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class S3BucketService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // not the anon key
  );

  async getFileUrl(bucket: string, key: string): Promise<string> {
    const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(key, 60 * 5); // expires in 5 minutes

    if (error) {
      throw new NotFoundException(`Failed to generate signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async uploadFile(bucket: string, file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException("No file uploaded");

    const filePath = `${Date.now()}-${file.originalname}`;

    const { error } = await this.supabase.storage.from(bucket).upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true, // replace if the file already exists
    });

    if (error) {
      throw new BadRequestException(`Failed to upload: ${error.message}`);
    }

    return filePath;
  }
}
