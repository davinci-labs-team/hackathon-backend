import { ApiProperty } from "@nestjs/swagger";

export class RequestPasswordResetDto {
  @ApiProperty({
    description: "Email of the user requesting a password reset",
    example: "user@example.com",
  })
  email: string;
}