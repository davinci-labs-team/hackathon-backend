export class CreateTeamDTO {
  name: string;
  description?: string;
  themeId: string;
  subjectId: string;
  memberIds?: string[];
  mentorIds?: string[];
  juryIds?: string[];
}
