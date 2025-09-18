import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";

export class FileResponseDto {
    @ApiProperty({
        description: "URL of the uploaded file",
        example: "https://your-supabase-url/storage/v1/object/public/annonces/1696156800000-yourfile.jpg"
    })
  url: string;
}