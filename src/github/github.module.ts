import { Module } from "@nestjs/common";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";
import { ConfigurationModule } from "src/configuration/configuration.module";

@Module({
  imports: [ConfigurationModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
