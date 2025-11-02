import { ApiProperty } from "@nestjs/swagger";

export class UploadResponseDto {
  @ApiProperty({
    description: "path of the uploaded file",
    example: "1696156800000-yourfile.jpg",
  })
  path: string;
}
