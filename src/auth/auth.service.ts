import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UUID } from 'crypto';
import { DiscordUser } from 'passport-discord-auth';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService) {}

  async getDiscordUser(code: string) {
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.OAUTH_DISCORD_CLIENT_ID!,
        client_secret: process.env.OAUTH_DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return userRes.data;
  }

  async updateUserWithDiscord(userId: string, supabaseUserId: string, discordUser: DiscordUser) {
    console.log('Updating user:', userId, supabaseUserId, discordUser);

    const userId_uuid = userId as UUID;

    const updatedUser = {
        discord: discordUser.id
    }
    
    await this.userService.update(userId_uuid, updatedUser, supabaseUserId);
  }
}
