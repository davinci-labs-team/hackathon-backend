import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { HackathonConfigKey, Role, TeamStatus, User } from "@prisma/client";
import { CreateTeamDTO } from "./dto/create-team.dto";
import { UpdateTeamDTO } from "./dto/update-team.dto";
import { TeamResponse } from "./dto/team-response";
import { Theme } from "src/configuration/entities/theme-subject.entity";
import { spawn } from "child_process";
import { join } from "path";
import * as path from "path";
import { promises as fs } from "fs";
import { MatchmakingTeam } from "./types/matchmaking-team.interface";
import { ThemesSettings } from "src/configuration/entities/themes_settings";

/*interface RawSubject {
  id: string;
  name: string;
  description: string;
}*/

/*interface RawTheme {
  id: string;
  name: string;
  description: string;
  subjects: RawSubject[];
}*/

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

  // ------------ AUTOGENERATE TEAMS ------------

  getThemeId(themes: Theme[], subjectId: string): string {
    for (const theme of themes) {
      if (theme.subjects.some((s) => s.id === subjectId)) {
        return theme.id;
      }
    }
    throw new NotFoundException(
      `No theme found for subject with id '${subjectId}'.`,
    );
  }

  getSubjectName(themes: Theme[], subjectId: string): string {
    for (const theme of themes) {
      const subject = theme.subjects.find((s) => s.id === subjectId);
      if (subject) {
        return subject.name;
      }
    }
    throw new NotFoundException(`No subject found with id '${subjectId}'.`);
  }

  async runMatchmakingScript(): Promise<MatchmakingTeam[]> {
    const scriptPath = path.join(process.cwd(), "python", "matchmaking.py");

    const pythonPath = path.join(process.cwd(), "venv", "bin", "python");

    return new Promise<MatchmakingTeam[]>((resolve, reject) => {
      const pythonProcess = spawn(pythonPath, [scriptPath]);

      let dataString: string = "";
      let errorString: string = "";

      pythonProcess.stdout.on("data", (data: Buffer) => {
        dataString += data.toString("utf-8");
      });

      pythonProcess.stderr.on("data", (data: Buffer) => {
        errorString += data.toString("utf-8");
      });

      pythonProcess.on("close", (code: number | null) => {
        if (code === 0) {
          try {
            const result: MatchmakingTeam[] = JSON.parse(
              dataString,
            ) as MatchmakingTeam[];
            resolve(result);
          } catch (err) {
            reject(
              new Error(
                `Failed to parse matchmaking script output: ${String(err)}`,
              ),
            );
          }
        } else {
          reject(
            new Error(
              `Matchmaking script exited with code ${code}: ${errorString}`,
            ),
          );
        }
      });
    });
  }

  async saveTmpMatchmakingSettingsFile(): Promise<void> {
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key: HackathonConfigKey.MATCHMAKING },
    });

    const tmpDir = join(process.cwd(), "python", "tmp_matchmaking");
    const filePath = join(tmpDir, "matchmaking_config.json");

    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(config?.value || {}), "utf-8");
  }

  async saveTmpUsersFile(usersJson: string): Promise<void> {
    const tmpDir = join(process.cwd(), "python", "tmp_matchmaking");
    const filePath = join(tmpDir, "users.json");

    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(filePath, usersJson, "utf-8");
  }

  private async assignRandomSubjectToUsersWithoutFavorite(): Promise<void> {
    const themesConfig = await this.prisma.hackathonConfig.findUnique({
      where: { key: HackathonConfigKey.THEMES },
    });

    if (!themesConfig) {
      console.warn(
        "No themes configuration found. Cannot assign random subjects.",
      );
      return;
    }

    const availableSubjects = this.parseThemesSettings(themesConfig.value)
      .flatMap((theme) => theme.subjects)
      .map((subject) => subject.id);

    if (availableSubjects.length === 0) {
      console.warn(
        "No subjects available in themes configuration. Cannot assign random subjects.",
      );
      return;
    }

    const usersToUpdate = await this.prisma.user.findMany({
      where: {
        role: Role.PARTICIPANT,
        favoriteSubjectId: null,
        teamId: null,
      },
      select: { id: true },
    });

    if (usersToUpdate.length === 0) {
      console.log(
        "No participants found without a favorite subject to update.",
      );
      return;
    }

    const updateOperations = usersToUpdate.map((user) => {
      const randomIndex = Math.floor(Math.random() * availableSubjects.length);
      const randomSubjectId = availableSubjects[randomIndex];

      return this.prisma.user.update({
        where: { id: user.id },
        data: { favoriteSubjectId: randomSubjectId },
      });
    });

    await this.prisma.$transaction(updateOperations);
  }

  async autogenerateTeams(supabaseUserId: string) {
    await this.validateUserRole(supabaseUserId, Role.ORGANIZER);
    await this.saveTmpMatchmakingSettingsFile();
    await this.assignRandomSubjectToUsersWithoutFavorite();

    let numberOfTeamsCreated = 0;

    const themes = await this.prisma.hackathonConfig.findUnique({
      where: { key: HackathonConfigKey.THEMES },
    });
    const subjectsIds = this.parseThemesSettings(
      themes ? themes.value : [],
    ).flatMap((t) => t.subjects.map((s) => s.id));

    const usersBySubject = await Promise.all(
      subjectsIds.map(async (subjectId) => {
        const users = await this.prisma.user.findMany({
          where: {
            role: Role.PARTICIPANT,
            favoriteSubjectId: subjectId,
            teamId: null,
          },
          select: { id: true, school: true },
        });
        return { subjectId, users };
      }),
    );

    for (const { subjectId, users } of usersBySubject) {
      if (users.length === 0) continue;

      await this.saveTmpUsersFile(JSON.stringify(users));

      const themeSettings = this.parseThemesSettings(
        themes ? themes.value : [],
      );

      const themeId = this.getThemeId(themeSettings, subjectId);
      const subjectName = this.getSubjectName(themeSettings, subjectId);

      const matchmakingTeams = await this.runMatchmakingScript();

      numberOfTeamsCreated += matchmakingTeams.length;

      for (let i = 0; i < matchmakingTeams.length; i++) {
        const mmTeam = matchmakingTeams[i];
        const teamName = `Team_${subjectName}_${i + 1}`;

        const createTeamDTO: CreateTeamDTO = {
          name: teamName,
          description: `Auto-generated team for subject ${subjectId}`,
          subjectId: subjectId,
          themeId: themeId,
          memberIds: mmTeam.members.map((m) => m.user_id),
        };

        await this.create(createTeamDTO, supabaseUserId);
      }

      return { count: numberOfTeamsCreated };
    }
  }

  // ------------------ CRUD ------------------

  async create(newTeamData: CreateTeamDTO, supabaseUserId: string) {
    await this.validateThemeAndSubject(
      newTeamData.themeId,
      newTeamData.subjectId,
    );

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
          connect: newTeamData.memberIds?.map((id) => ({ id })) || [],
        },
        juries: {
          connect: newTeamData.juryIds?.map((id) => ({ id })) || [],
        },
        mentors: {
          connect: newTeamData.mentorIds?.map((id) => ({ id })) || [],
        },
      },
    });

    return { id: team.id };
  }

  async update(
    id: string,
    updateTeamData: UpdateTeamDTO,
    supabaseUserId: string,
  ) {
    await this.checkTeamExists(id);
    if (updateTeamData.themeId && updateTeamData.subjectId) {
      await this.validateThemeAndSubject(
        updateTeamData.themeId,
        updateTeamData.subjectId,
      );
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
          ? { set: updateTeamData.memberIds.map((id) => ({ id })) }
          : undefined,
        juries: updateTeamData.juryIds
          ? { set: updateTeamData.juryIds.map((id) => ({ id })) }
          : undefined,
        mentors: updateTeamData.mentorIds
          ? { set: updateTeamData.mentorIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    return { id: team.id };
  }

  async updateStatus(id: string, status: TeamStatus, supabaseUserId: string) {
    await this.validateUserAndTeam(id, supabaseUserId);

    const team = await this.prisma.team.update({
      where: { id },
      data: { status },
    });

    return { id: team.id };
  }

  async updateIgnoreConstraints(
    id: string,
    ignoreConstraints: boolean,
    supabaseUserId: string,
  ) {
    await this.validateUserAndTeam(id, supabaseUserId);

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

  async assignUserToTeam(
    teamId: string,
    userId: string,
    supabaseUserId: string,
    isParticipant: boolean,
  ) {
    await this.validateUserAndTeam(teamId, supabaseUserId, isParticipant);

    const user = await this.validateUserExists(userId);
    if (user.teamId) {
      throw new ForbiddenException(
        `User with id '${userId}' is already a member of team with id '${user.teamId}'.`,
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

  async leaveTeam(supabaseUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });

    if (!user) throw new NotFoundException("User not found.");

    if (!user.teamId) {
      throw new ForbiddenException("You are not part of any team.");
    }

    return this.disconnectUserFromTeam(user.teamId, user);
  }

  async joinTeam(teamId: string, supabaseUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });

    if (!user) throw new NotFoundException("User not found.");

    if (user.role !== Role.PARTICIPANT) {
      throw new ForbiddenException("Only participants can join teams.");
    }

    if (user.teamId) {
      throw new ForbiddenException("You are already part of a team.");
    }

    await this.checkTeamExists(teamId);

    // Add user to team
    const team = await this.prisma.team.update({
      where: { id: teamId },
      data: { members: { connect: { id: user.id } } },
    });

    return { id: team.id };
  }

  async withdrawUserFromTeam(
    teamId: string,
    userId: string,
    supabaseUserId: string,
    isParticipant: boolean,
  ) {
    await this.validateUserAndTeam(teamId, supabaseUserId, isParticipant);

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
            `User with id '${user.id}' is not a member of team with id '${teamId}'.`,
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
        throw new ForbiddenException(
          `Cannot withdraw user with role '${user.role}' from a team.`,
        );
    }

    const team = await this.prisma.team.update({
      where: { id: teamId },
      data: { [relationKey]: { disconnect: { id: user.id } } },
    });

    return { id: team.id };
  }

  async remove(id: string, supabaseUserId: string) {
    await this.validateUserAndTeam(id, supabaseUserId);

    const team = await this.prisma.team.delete({ where: { id } });
    return { id: team.id };
  }

  // ------------------ Utils ------------------

  private async validateUserRole(supabaseUserId: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { supabaseUserId },
    });
    if (!user) throw new NotFoundException("User not found.");
    if (user.role !== role)
      throw new ForbiddenException("Only organizer can perform this action.");
    return user;
  }

  private async validateUserExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id '${id}' not found.`);
    return user;
  }

  private async validateUsersExist(userIds: string[]) {
    if (!userIds.length || userIds.length === 0) return;

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const foundIds = users.map((u) => u.id);
    const missingIds = userIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length) {
      throw new NotFoundException(`Users not found: ${missingIds.join(", ")}`);
    }
  }

  private async checkTeamExists(teamId: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team)
      throw new NotFoundException(`Team with id '${teamId}' not found.`);
    return team;
  }

  private async validateUserAndTeam(
    teamId: string,
    supabaseUserId: string,
    isParticipant = false,
  ) {
    if (isParticipant) {
      this.validateUserRole(supabaseUserId, Role.PARTICIPANT);
    } else {
      await this.validateUserRole(supabaseUserId, Role.ORGANIZER);
      return this.checkTeamExists(teamId);
    }
  }

  private parseThemesSettings(value: unknown): Theme[] {
    if (!value || typeof value !== "object" || !("themes" in value)) return [];
    const settings = value as ThemesSettings;
    return settings.themes ?? [];
  }

  private async validateThemeAndSubject(themeId: string, subjectId: string) {
    const config = await this.prisma.hackathonConfig.findUnique({
      where: { key: HackathonConfigKey.THEMES },
    });
    if (!config) throw new NotFoundException("No themes configuration found.");

    const themes = this.parseThemesSettings(config.value);
    const theme = themes.find((t) => t.id === themeId);
    if (!theme)
      throw new NotFoundException(`Theme with id '${themeId}' not found.`);

    const subject = theme.subjects.find((s) => s.id === subjectId);
    if (!subject)
      throw new NotFoundException(
        `Subject with id '${subjectId}' not found in theme '${themeId}'.`,
      );
  }
}
