import { TeamStatus } from "@prisma/client";
import { UserPreviewDTO } from "./user-preview.dto";

export class TeamResponse {
  id: string;
  name: string;
  description?: string;
  themeId: string;
  subjectId: string;
  status: TeamStatus;
  ignoreConstraints: boolean;
  createdAt: Date;

  members: UserPreviewDTO[];
  juries: UserPreviewDTO[];
  mentors: UserPreviewDTO[];
}