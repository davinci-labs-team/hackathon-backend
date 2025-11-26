import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    description: "The email of the user requesting the password reset",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({
    description: "The new password for the user",
    example: "NewSecurePassword123!",
  })
  newPassword: string;

  @ApiProperty({
    description: "A generated token to authorize the password reset",
    example: "reset-token-123456",
  })
  token: string;
}
