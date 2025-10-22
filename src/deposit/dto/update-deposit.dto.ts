import { ApiProperty } from "@nestjs/swagger";
import { DepositStatus } from "@prisma/client";
import { IsOptional, IsUUID } from "class-validator";

export class UpdateDepositDto {
  @ApiProperty({
    description: "The ID of the team associated with the deposit to evaluate",
    example: "12345",
  })
  @IsUUID()
  teamId: string;

  @ApiProperty({
    description: "List of files associated with the deposit",
    example: ["file1.pdf", "file2.pdf"],
  })
  @IsOptional()
  files: string[];

  @ApiProperty({
    description: "Status of the deposit",
    example: DepositStatus.SUBMITTED,
  })
  @IsOptional()
  depositStatus: DepositStatus;

  @ApiProperty({
    description: "Comments related to the deposit",
    example: "Please review my submission.",
    required: false,
  })
  @IsOptional()
  comments?: string;
}
