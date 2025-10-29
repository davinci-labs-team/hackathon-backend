import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GithubService {
    constructor(private prismaService: PrismaService) {}

    async createPrivateRepo(supabaseUserId: string) {
        const user = await this.prismaService.user.findUnique({
            where: { supabaseUserId },
        });

        if (!user || !user.github) {
            throw new Error('GitHub user not linked');
        }

        // user.github might be a JSON string or an object and token keys vary.
        const githubData =
            typeof user.github === 'string' ? JSON.parse(user.github) : user.github;
        const userGithubToken =
            githubData?.accessToken ?? githubData?.token ?? githubData?.access_token;
        if (!userGithubToken) {
            throw new Error('GitHub access token not found on user.github');
        }
        const day = String(new Date().getDate()).padStart(2, '0');
        const repoName = `private-repo-hackathon-${day}`;
    
        const res = await axios.post(
            'https://api.github.com/user/repos',
            {
            name: repoName,
            private: true,
            description: 'Private repo created by our app 🚀',
            },
            {
            headers: {
                Authorization: `Bearer ${userGithubToken}`,
                Accept: 'application/vnd.github+json',
            },
            },
        );

        return res.data;
    }

}
