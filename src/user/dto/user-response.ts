import { ApiProperty } from "@nestjs/swagger";

export class UserResponse {
    @ApiProperty({
    description: "Unique identifier for the user",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  id: string;

    @ApiProperty({
        description: "Name of the user",
        example: "John Doe",
    })
  name: string;

    @ApiProperty({
        description: "Email address of the user",
        example: "test.user@mail.com",
    })
  email: string;

    @ApiProperty({
        description: "Date when the user was created",
        example: "2023-10-01T12:00:00Z",
        type: String,
        format: "date-time",
    })
  createdAt: Date;
}