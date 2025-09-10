import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateSettingDTO } from "./create-settings.dto";

export class UpdateSettingDTO extends PartialType(CreateSettingDTO) {}
  