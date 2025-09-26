import { PartialType } from "@nestjs/swagger";
import { CreateAnnouncementDto } from "./create-announcement.dto";

export class PatchAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
