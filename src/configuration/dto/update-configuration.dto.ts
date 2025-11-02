import { PartialType } from "@nestjs/swagger";
import { CreateConfigurationDTO } from "./create-configuration.dto";

export class UpdateConfigurationDTO extends PartialType(CreateConfigurationDTO) {}
