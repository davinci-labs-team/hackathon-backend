import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";

// Define the possible shapes of GitHub data
interface GitHubData {
  accessToken?: string;
  token?: string;
  access_token?: string;
  [key: string]: unknown;
}

export interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  [key: string]: unknown;
}

@Injectable()
export class GithubService {
  constructor(private prismaService: PrismaService) {}

  async createPrivateRepo(supabaseUserId: string): Promise<GitHubRepoResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { supabaseUserId },
    });

    if (!user || !user.github) {
      throw new Error("GitHub user not linked");
    }

    // Parse and type the github data
    const githubData: GitHubData =
      typeof user.github === "string"
        ? (JSON.parse(user.github) as GitHubData)
        : (user.github as GitHubData);

    const userGithubToken = githubData.accessToken ?? githubData.token ?? githubData.access_token;

    if (!userGithubToken) {
      throw new Error("GitHub access token not found on user.github");
    }

    const day = String(new Date().getDate()).padStart(2, "0");
    const repoName = `private-repo-hackathon-${day}`;

    const res = await axios.post<GitHubRepoResponse>(
      "https://api.github.com/user/repos",
      {
        name: repoName,
        private: true,
        description: "Private repo created by our app 🚀",
      },
      {
        headers: {
          Authorization: `Bearer ${userGithubToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    return res.data;
  }
}
