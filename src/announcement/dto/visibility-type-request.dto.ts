import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { VisibilityType } from "../enums/visibility-type.enum";

export class VisibilityTypeRequest {
  @ApiProperty({
    enum: VisibilityType,
    enumName: "VisibilityType",
    required: false,
    description: "Type de visibilité pour filtrer les annonces",
    default: VisibilityType.BOTH,
  })
  @IsOptional()
  visibilityType?: VisibilityType;
}
