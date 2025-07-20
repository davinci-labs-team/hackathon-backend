import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UserResponse {
  @ApiProperty({
    description: "Unique identifier for the user",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "Supabase user ID",
    example: "76a54a08-282a-4aeb-900c-739ed2e413ca",
  })
  supabaseUserId: string;

  @ApiProperty({
    description: "Name of the user",
    example: "John Doe",
  })
  name: string;

  @ApiProperty({
    description: "Date when the user was created",
    example: "2023-10-01T12:00:00Z",
    type: String,
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Role of the user",
    example: "USER",
    enum: Role,
  })
  role: Role;
}
