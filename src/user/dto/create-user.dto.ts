import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Name of the user",
    example: "John Doe",
  })
  name: string;
}
