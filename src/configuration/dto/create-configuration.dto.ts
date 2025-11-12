import { ApiProperty } from "@nestjs/swagger";
import { HackathonConfigKey } from "@prisma/client";

export class CreateConfigurationDTO {
  @ApiProperty({
    description: "Key of the setting (ex: hackathon_config)",
    example: "hackathon_config",
  })
  key: HackathonConfigKey;

  @ApiProperty({
    description: "JSON object to store",
    type: Object,
  })
  value: Record<string, any>;
}
