import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Role, TeamStatus, User } from "@prisma/client";
import { CreateTeamDTO } from "./dto/create-team.dto";
import { UpdateTeamDTO } from "./dto/update-team.dto";
import { TeamResponse } from "./dto/team-response";
import { Theme } from "src/configuration/entities/theme-subject.entity";

interface RawSubject {
  id: string;
  name: string;
  description: string;
}

interface RawTheme {
  id: string;
  name: string;
  description: string;
  subjects: RawSubject[];
}

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  private userPreviewSelect = {
    id: true,
    firstname: true,
    lastname: true,
    school: true,
    role: true,
  };

  // ------------------ CRUD ------------------

  async create(newTeamData: CreateTeamDTO, supabaseUserId: string) {
    await this.validateUserRole(supabaseUserId, Role.ORGANIZER);
    await this.validateThemeAndSubject(newTeamData.themeId, newTeamData.subjectId);

    await Promise.all([
      this.validateUsersExist(newTeamData.memberIds || []),
      this.validateUsersExist(newTeamData.juryIds || []),
      this.validateUsersExist(newTeamData.mentorIds || []),
    ]);

    const team = await this.prisma.team.create({
      data: {
        name: newTeamData.name,
        description: newTeamData.description,
        themeId: newTeamData.themeId,
        subjectId: newTeamData.subjectId,
        members: {
          connect: newTeamData.memberIds?.map(id => ({ id })) || [],
        },
        juries: {
          connect: newTeamData.juryIds?.map(id => ({ id })) || [],
        },
        mentors: {
          connect: newTeamData.mentorIds?.map(id => ({ id })) || [],
        },
      },
    });

    return { id: team.id };
  }

  async update(id: string, updateTeamData: UpdateTeamDTO, supabaseUserId: string) {
    await this.validateOrganizerAndTeam(id, supabaseUserId);
    if (updateTeamData.themeId && updateTeamData.subjectId) {
      await this.validateThemeAndSubject(updateTeamData.themeId, updateTeamData.subjectId);
    }

    await Promise.all([
      this.validateUsersExist(updateTeamData.memberIds || []),
      this.validateUsersExist(updateTeamData.juryIds || []),
      this.validateUsersExist(updateTeamData.mentorIds || []),
    ]);

    const team = await this.prisma.team.update({
      where: { id },
      data: {
        name: updateTeamData.name,
        description: updateTeamData.description,
        themeId: updateTeamData.themeId,
        subjectId: updateTeamData.subjectId,
        members: updateTeamData.memberIds
          ? { set: updateTeamData.memberIds.map(id => ({ id })) }
          : undefined,
        juries: updateTeamData.juryIds
          ? { set: updateTeamData.juryIds.map(id => ({ id })) }
          : undefined,
        mentors: updateTeamData.mentorIds
          ? { set: updateTeamData.mentorIds.map(id => ({ id })) }
          : undefined,
      },
    });

    return { id: team.id };
  }

  async updateStatus(id: string, status: TeamStatus, supabaseUserId: string) {
    await this.validateOrganizerAndTeam(id, supabaseUserId);

    const team = await this.prisma.team.update({
      where: { id },
      data: { status },
    });

    return { id: team.id };
  }

  async updateIgnoreConstraints(id: string, ignoreConstraints: boolean, supabaseUserId: string) {
    await this.validateOrganizerAndTeam(id, supabaseUserId);

    const team = await this.prisma.team.update({
      where: { id },
      data: { ignoreConstraints },
    });

    return { id: team.id };
  }

  async findOne(id: string): Promise<TeamResponse> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: { select: this.userPreviewSelect },
        juries: { select: this.userPreviewSelect },
        mentors: { select: this.userPreviewSelect },
      },
    });

    if (!team) throw new NotFoundException(`Team with id '${id}' not found`);
    return team as TeamResponse;
  }

  async findAll(): Promise<TeamResponse[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        members: { select: this.userPreviewSelect },
        juries: { select: this.userPreviewSelect },
        mentors: { select: this.userPreviewSelect },
      },
    });

    return teams as TeamResponse[];
  }

  async assignUserToTeam(teamId: string, userId: string, supabaseUserId: string) {
    await this.validateOrganizerAndTeam(teamId, supabaseUserId);

    const user = await this.validateUserExists(userId);
    if (user.teamId) {
      throw new ForbiddenException(
        `User with id '${userId}' is already a member of team with id '${user.teamId}'.`
      );
    }

    let proprety = "members";
    switch (user.role) {
      case Role.JURY:
        proprety = "juries";
        break;
      case Role.MENTOR:
        proprety = "mentors";
        break;
    }

    const team = await this.prisma.team.update({
      where: { id: teamId },
      data: { [proprety]: { connect: { id: userId } } },
    });

    return { id: team.id };
  }

  async withdrawUserFromTeam(teamId: string, userId: string, supabaseUserId: string) {
    await this.validateOrganizerAndTeam(teamId, supabaseUserId);

    const user = await this.validateUserExists(userId);

    return this.disconnectUserFromTeam(teamId, user);
  }

  /**
   * Fonction chapeau : gère le retrait d’un user d’une team selon son rôle
   */
  private async disconnectUserFromTeam(teamId: string, user: User) {
    let relationKey: "members" | "juries" | "mentors";

    switch (user.role) {
      case Role.PARTICIPANT:
        if (user.teamId !== teamId) {
          throw new ForbiddenException(
            `User with id '${user.id}' is not a member of team with id '${teamId}'.`
          );
        }
        relationKey = "members";
        break;

      case Role.JURY:
        relationKey = "juries";
        break;

      case Role.MENTOR:
        relationKey = "mentors";
        break;

      default:
        throw new ForbiddenException(`Cannot withdraw user with role '${user.role}' from a team.`);
    }

    const team = await this.prisma.team.update({
      where: { id: teamId },
      data: { [relationKey]: { disconnect: { id: user.id } } },
    });

    return { id: team.id };
  }

  async remove(id: string, supabaseUserId: string) {
    await this.validateOrganizerAndTeam(id, supabaseUserId);

    const team = await this.prisma.team.delete({ where: { id } });
    return { id: team.id };
  }

  // ------------------ Utils ------------------

  private async validateUserRole(supabaseUserId: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });
    if (!user) throw new NotFoundException("User not found.");
    if (user.role !== role) throw new ForbiddenException("Only organizer can perform this action.");
    return user;
  }

  private async validateUserExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id '${id}' not found.`);
    return user;
  }

  private async validateUsersExist(userIds: string[]) {
    if (!userIds.length) return;

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const foundIds = users.map(u => u.id);
    const missingIds = userIds.filter(id => !foundIds.includes(id));
    if (missingIds.length) {
      throw new NotFoundException(`Users not found: ${missingIds.join(", ")}`);
    }
  }

  private async checkTeamExists(teamId: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException(`Team with id '${teamId}' not found.`);
    return team;
  }

  private async validateOrganizerAndTeam(teamId: string, supabaseUserId: string) {
    await this.validateUserRole(supabaseUserId, Role.ORGANIZER);
    return this.checkTeamExists(teamId);
  }

  // TODO: Refacto to secure theme and subject validation when creating/updating a team
  // Add these interfaces at the top of your file (or in a separate types file)

  // Replace the parseThemes method with this type-safe version:
  private parseThemes(value: unknown): Theme[] {
    if (!Array.isArray(value)) return [];

    return value.map((t: unknown) => {
      // Type guard to ensure t is an object with the expected properties
      if (!this.isRawTheme(t)) {
        throw new Error("Invalid theme structure");
      }

      return {
        id: t.id,
        name: t.name,
        description: t.description,
        subjects: Array.isArray(t.subjects)
          ? t.subjects.map((s: unknown) => {
              if (!this.isRawSubject(s)) {
                throw new Error("Invalid subject structure");
              }
              return {
                id: s.id,
                name: s.name,
                description: s.description,
              };
            })
          : [],
      };
    });
  }

  // Add these type guard methods
  private isRawTheme(value: unknown): value is RawTheme {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "string" &&
      "name" in value &&
      typeof value.name === "string" &&
      "description" in value &&
      typeof value.description === "string" &&
      "subjects" in value
    );
  }

  private isRawSubject(value: unknown): value is RawSubject {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "string" &&
      "name" in value &&
      typeof value.name === "string" &&
      "description" in value &&
      typeof value.description === "string"
    );
  }

  private async validateThemeAndSubject(themeId: string, subjectId: string) {
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key: "THEMES" },
    });
    if (!config) throw new NotFoundException("No themes configuration found.");

    const themes = this.parseThemes(config.value);
    const theme = themes.find(t => t.id === themeId);
    if (!theme) throw new NotFoundException(`Theme with id '${themeId}' not found.`);

    const subject = theme.subjects.find(s => s.id === subjectId);
    if (!subject)
      throw new NotFoundException(
        `Subject with id '${subjectId}' not found in theme '${themeId}'.`
      );
  }
}
