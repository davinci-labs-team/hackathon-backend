import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { Role, TeamStatus } from "@prisma/client";
import { CreateTeamDTO } from './dto/create-team.dto';
import { TeamResponse } from './dto/team-response';
import { UpdateTeamDTO } from './dto/update-team.dto';

@Injectable()
export class TeamService {
    constructor(private readonly prisma: PrismaService) {}

    userPreviewSelect = {
        id: true,
        firstname: true,
        lastname: true,
        school: true,
        role: true
    };
    
    async create(newTeamData: CreateTeamDTO, supabaseUserId: string) {
        await this.validateUserRole(supabaseUserId, Role.ORGANIZER);

        const team = await this.prisma.team.create({
            data: {
                ...newTeamData,
                members: {
                    connect: newTeamData.memberIds?.map(id => ({ id })) || []
                },
                juries: {
                    connect: newTeamData.juryIds?.map(id => ({ id }))
                },
                mentors: {
                    connect: newTeamData.mentorIds?.map(id => ({ id }))
                }
            }
        });
        return { id: team.id };
    }

    async update(id: string, updateTeamData: UpdateTeamDTO, supabaseUserId: string) {
        await this.validateUserRole(supabaseUserId, Role.ORGANIZER);

        const team = await this.prisma.team.update({
            where: { id },
            data: {
                ...updateTeamData,
                members: updateTeamData.memberIds ? {
                    set: updateTeamData.memberIds.map(id => ({ id }))
                } : undefined,
                juries: updateTeamData.juryIds ? {
                    set: updateTeamData.juryIds.map(id => ({ id }))
                } : undefined,
                mentors: updateTeamData.mentorIds ? {
                    set: updateTeamData.mentorIds.map(id => ({ id }))
                } : undefined,
            }
        });
        return { id: team.id };
    }

    async updateStatus(id: string, status: TeamStatus, supabaseUserId: string) {
        await this.validateUserRole(supabaseUserId, Role.ORGANIZER);

        const team = await this.prisma.team.update({
            where: { id },
            data: { status }
        });
        return { id: team.id };
    }

    async updateIgnoreConstraints(id: string, ignoreConstraints: boolean, supabaseUserId: string) {
        await this.validateUserRole(supabaseUserId, Role.ORGANIZER);

        const team = await this.prisma.team.update({
            where: { id },
            data: { ignoreConstraints }
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
            }
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
            }
        });
        return teams as TeamResponse[];
    }

    private async validateUserRole(supabaseUserId: string, role: Role) {
        const existUser = await this.prisma.user.findUnique({
          where: { supabaseUserId },
        });
        if (!existUser) {
          throw new NotFoundException("User not found.");
        }
        if (existUser?.role !== role) {
          throw new ForbiddenException("Only organizer can create FAQs.");
        }
      }
}
