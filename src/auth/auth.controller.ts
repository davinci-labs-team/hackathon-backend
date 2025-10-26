import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -----------------------------
  // DISCORD CALLBACK
  // -----------------------------
  @Get('discord/callback')
  @Public()
  async discordCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback({
      provider: 'discord',
      code,
      state,
      error,
      res,
      getUser: (c) => this.authService.getDiscordUser(c),
      updateUser: (decoded, user) =>
        this.authService.updateUserWithDiscord(
          decoded.userId,
          decoded.supabaseUserId,
          user,
        ),
    });
  }

  // -----------------------------
  // GITHUB CALLBACK
  // -----------------------------
  @Get('github/callback')
  @Public()
  async githubCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback({
      provider: 'github',
      code,
      state,
      error,
      res,
      getUser: (c) => this.authService.getGithubUser(c),
      updateUser: (decoded, user) =>
        this.authService.updateUserWithGithub(
          decoded.userId,
          decoded.supabaseUserId,
          user,
        ),
    });
  }

  private async handleOAuthCallback({
    provider,
    code,
    state,
    error,
    res,
    getUser,
    updateUser,
  }: {
    provider: 'discord' | 'github';
    code: string;
    state: string;
    error: string;
    res: Response;
    getUser: (code: string) => Promise<any>;
    updateUser: (decoded: any, user: any) => Promise<void>;
  }) {
    let decoded: any = null;
    if (state) {
      try {
        decoded = JSON.parse(decodeURIComponent(state));
      } catch (e) {
        console.warn(`Failed to decode state for ${provider}:`, e);
      }
    }

    if (error === 'access_denied') {
      return res.redirect(this.getRedirectUri(decoded?.organizerPlatform, `${provider}_cancelled`));
    }

    if (!code || !state) {
      return res.status(400).send(`Missing code or state for ${provider}`);
    }

    try {
      const user = await getUser(code);
      await updateUser(decoded, user);

      return res.redirect(this.getRedirectUri(decoded.organizerPlatform));
    } catch (err) {
      console.error(`${provider} OAuth2 flow failed:`, err);
      return res.redirect(this.getRedirectUri(decoded?.organizerPlatform, `${provider}_error`));
    }
  }

  private getRedirectUri(organizerPlatform: boolean, error?: string): string {
    const base = organizerPlatform
      ? 'http://localhost:5173/organizer/profile'
      : 'http://localhost:5173/user/profile';

    return error ? `${base}?error=${error}` : base;
  }
}
