import { Controller, Get, Post } from '@nestjs/common';
import { SupabaseDecodedUser } from 'src/common/decorators/supabase-decoded-user.types';
import { SupabaseUser } from 'src/common/decorators/supabase-user.decorator';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    @Post("/create-repo")
    create(@SupabaseUser() supabaseUser: SupabaseDecodedUser) {
      return this.githubService.createPrivateRepo(supabaseUser.sub);
    }
}
