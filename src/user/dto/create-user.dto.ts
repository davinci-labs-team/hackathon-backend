import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
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
}
