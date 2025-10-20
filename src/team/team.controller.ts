import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { TeamService } from './team.service';
import { CreateTeamDTO } from './dto/create-team.dto';
import { SupabaseUser } from "../common/decorators/supabase-user.decorator";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { TeamStatus } from "@prisma/client";

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post()
    async create(
        @Body() newTeamData: CreateTeamDTO,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.teamService.create(newTeamData, supabaseUser.sub);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTeamData: Partial<CreateTeamDTO>,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.teamService.update(id, updateTeamData, supabaseUser.sub);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: TeamStatus,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.teamService.updateStatus(id, status, supabaseUser.sub);
    }

    @Patch(':id/ignore-constraints')
    async updateIgnoreConstraints(
        @Param('id') id: string,
        @Body('ignoreConstraints') ignoreConstraints: boolean,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.teamService.updateIgnoreConstraints(id, ignoreConstraints, supabaseUser.sub);
    }

    /*@Patch(':teamId/assign-user/:userId')
    async assignUserToTeam(
        @Param('teamId') teamId: string,
        @Param('userId') userId: string,
        @SupabaseUser() supabaseUser: SupabaseDecodedUser
    ) {
        return this.teamService.assignUserToTeam(teamId, userId, supabaseUser.sub);
    }*/

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return this.teamService.findOne(id);
        } catch (error) {
            throw error;
        }
    }

    @Get()
    async findAll() {
        return this.teamService.findAll();
    }



}
