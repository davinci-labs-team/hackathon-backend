import { ApiProperty } from '@nestjs/swagger'

export class CreateConfigurationDTO {
  @ApiProperty({
    description: 'Key of the setting (ex: hackathon_config)',
    example: 'hackathon_config',
  })
  key: string

  @ApiProperty({
    description: 'JSON object to store',
    type: Object,
  })
  value: Record<string, any>
}