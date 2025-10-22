import { Controller, Get, Post, Body, Put, Patch, Param, Delete, HttpException, HttpStatus } from "@nestjs/common";
import { TeamService } from './team.service';
import { CreateTeamDTO } from './dto/create-team.dto';
import { SupabaseUser } from "../common/decorators/supabase-user.decorator";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { TeamStatus } from "@prisma/client";
import { UpdateTeamDTO } from "./dto/update-team.dto";

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    private async handleRequest(fn: () => Promise<any>) {
        try {
            return await fn();
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error(error);
            throw new HttpException(error?.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    async create(
        @Body() newTeamData: CreateTeamDTO,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.handleRequest(() => this.teamService.create(newTeamData, supabaseUser.sub));
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTeamData: UpdateTeamDTO,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.handleRequest(() => this.teamService.update(id, updateTeamData, supabaseUser.sub));
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: TeamStatus,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.handleRequest(() => this.teamService.updateStatus(id, status, supabaseUser.sub));
    }

    @Patch(':id/ignore-constraints')
    async updateIgnoreConstraints(
        @Param('id') id: string,
        @Body('ignoreConstraints') ignoreConstraints: boolean,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.handleRequest(() => this.teamService.updateIgnoreConstraints(id, ignoreConstraints, supabaseUser.sub));
    }

    @Patch(':teamId/assign-user/:userId')
    async assignUserToTeam(
        @Param('teamId') teamId: string,
        @Param('userId') userId: string,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.handleRequest(() => this.teamService.assignUserToTeam(teamId, userId, supabaseUser.sub));
    }

    @Patch(':teamId/withdraw-user/:userId')
    async withdrawUserFromTeam(
        @Param('teamId') teamId: string,
        @Param('userId') userId: string,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.handleRequest(() => this.teamService.withdrawUserFromTeam(teamId, userId, supabaseUser.sub));
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.handleRequest(() => this.teamService.findOne(id));
    }

    @Get()
    async findAll() {
        return this.handleRequest(() => this.teamService.findAll());
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.handleRequest(() => this.teamService.remove(id, supabaseUser.sub));
    }
}
