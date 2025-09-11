import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class CreateUserDto {
  @ApiProperty({
    description: "Firstname of the user",
    example: "John",
  })
  firstname: string;

  @ApiProperty({
    description: "Lastname of the user",
    example: "Doe",
  })
  lastname: string;

  @ApiProperty({
    description: "Email of the user",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Role of the user",
    example: "PARTICIPANT",
    required: true,
  })
  role: Role;

  @ApiProperty({
    description: "School of the user",
    example: "Harvard University",
    required: false,
  })
  school: string | null;
}
