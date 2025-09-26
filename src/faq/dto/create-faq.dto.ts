import { ApiProperty } from "@nestjs/swagger";

export class CreateFaqDto {
  @ApiProperty({
    description: "Question of the FAQ",
    example: "What is NestJS?",
  })
  question: string;

  @ApiProperty({
    description: "Answer of the FAQ",
    example: "NestJS is a progressive Node.js framework for building efficient and scalable server-side applications.",
  })
  answer: string;

  @ApiProperty({
    description: "Indicates if the FAQ item is private",
    example: false,
  })
  isPrivate: boolean;
}