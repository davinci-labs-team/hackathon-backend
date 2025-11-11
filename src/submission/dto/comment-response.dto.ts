import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CommentResponseDTO {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  id: string;

  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  submissionId: string;

  @ApiProperty({ example: "mentor-456" })
  @IsString()
  mentorId: string;

  @ApiProperty({ example: "Pensez à améliorer la documentation du code" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: Date, format: "date-time" })
  @IsDate()
  createdAt: Date;
}