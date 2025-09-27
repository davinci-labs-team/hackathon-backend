import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty, IsBoolean } from "class-validator";

export class CreateAnnouncementDto {
  @ApiProperty({
    description: "Title of the hackathon announcement",
    example: "Registration is now open!",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Tags related to the announcement",
    example: ["registration", "deadline", "teams"],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: "Detailed description of the announcement",
    example:
      "The registration for Hackathon 2025 is now officially open. Teams must register before March 15th.",
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: [String],
    description: "Optional file attachments",
    example: ["file1.png", "document.pdf"],
    required: false,
  })
  files?: string[];

  @ApiProperty({
    description: "Indicates if the announcement is private",
    example: false,
  })
  @IsBoolean()
  isPrivate: boolean;
}
