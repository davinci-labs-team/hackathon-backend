import { ApiProperty } from "@nestjs/swagger";

export class FaqResponse {
  @ApiProperty({
    description: "Unique identifier for the FAQ entry",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "The question being asked",
    example: "How do I reset my password?",
  })
  question: string;

  @ApiProperty({
    description: "The answer to the question",
    example:
      "To reset your password, click on 'Forgot Password' at the login screen and follow the instructions.",
  })
  answer: string;

  @ApiProperty({
    description: "If the FAQ is private or public",
    example: false,
    type: Boolean,
  })
  isPrivate: boolean;

  @ApiProperty({
    description: "Date when the FAQ entry was created",
    example: "2023-10-01T12:00:00Z",
    type: String,
    format: "date-time",
  })
  createdAt: Date;
}
