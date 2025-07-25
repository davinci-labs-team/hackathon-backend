import { ApiProperty } from "@nestjs/swagger";

export class SupabaseDecodedUser {
  @ApiProperty({
    description: "Unique identifier for the user (UUID format)",
    example: "cc31ac03-58ef-4821-a445-61f289882e36",
    format: "uuid",
    readOnly: true,
  })
  sub: string;

  @ApiProperty({
    description: "Primary email address of the authenticated user",
    example: "testutilisateur2@gmail.com",
    format: "email",
    readOnly: true,
  })
  email: string;

  @ApiProperty({
    description: "Phone number of the user (empty string if not provided)",
    example: "+33123456789",
    required: false,
    default: "",
    readOnly: true,
  })
  phone: string;

  @ApiProperty({
    description: "User role in the application",
    example: "authenticated",
    enum: ["authenticated", "admin", "moderator", "user"],
    default: "authenticated",
    readOnly: true,
  })
  role: string;

  @ApiProperty({
    description: "Unique identifier for the current authentication session",
    example: "da36fd86-ac00-4b95-9c50-2ae9ec4f93d5",
    format: "uuid",
    readOnly: true,
  })
  session_id: string;

  @ApiProperty({
    description: "Indicates whether the user is authenticated anonymously",
    example: false,
    default: false,
    readOnly: true,
  })
  is_anonymous: boolean;
}
