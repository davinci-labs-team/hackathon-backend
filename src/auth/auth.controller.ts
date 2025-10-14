import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord/callback')
  @Public()
  async discordCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      return res.status(400).send('Missing code or state');
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(state));
      const discordUser = await this.authService.getDiscordUser(code);

      await this.authService.updateUserWithDiscord(
        decoded.userId,
        decoded.supabaseUserId,
        discordUser,
      );

      const redirectUrl = decoded.organizerPlatform
        ? 'http://localhost:5173/organizer/profile'
        : 'http://localhost:5173/user/profile';

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
      return res.status(400).send('OAuth2 Discord flow failed');
    }
  }

  @Get('github/callback')
  @Public()
  async githubCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      return res.status(400).send('Missing code or state');
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(state));
      const githubUser = await this.authService.getGithubUser(code);

      await this.authService.updateUserWithGithub(
        decoded.userId,
        decoded.supabaseUserId,
        githubUser,
      );

      const redirectUrl = decoded.organizerPlatform
        ? 'http://localhost:5173/organizer/profile'
        : 'http://localhost:5173/user/profile';

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
      return res.status(400).send('OAuth2 Github flow failed');
    }
  }
}


