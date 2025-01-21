import { plainToInstance } from "class-transformer";
import { AppSettings } from "../redis/redis";
import { RepoRepository } from "../repository/repo";
import { Config, getConfigInstance } from "../config/config";
import { GithubRepo } from "../../github/repo_service";
import { MaxStars, RepoInfo } from "../db/entities/repo_entity";
import Redis from "ioredis";
import { RepoResponse } from "../../github/models";

let repoController: RepoController | null = null;
export class RepoController {
  public constructor(
    public appSetting: AppSettings,
    public repoRepository: RepoRepository,
    public repoClient: GithubRepo,
    public config = getConfigInstance(),
  ) {}

  async getRepoByName(name: string) {
    return await this.repoRepository.getRepoByName(name);
  }

  async getRepoByLanguage(language: string) {
      const repos = await this.repoRepository.getRepoByLanguage(language);
      return plainToInstance(RepoInfo, repos);
  }

  async getReposWithMostStars(limit: number = 1): Promise<Array<MaxStars>> {
    return await this.repoRepository.getReposWithMostStars(limit);
  }

  async setSetting(
    repo: string,
    startDate: string,
    cronDelay?: string,
    owner?: string,
  ): Promise<boolean> {
    return await this.appSetting.initAppSettings(
      repo,
      startDate,
      cronDelay,
      owner,
    );
  }

  async fetchAndSaveRepo() {
    const settings = await this.appSetting.getAppSettings(this.config);
    const repo = await this.repoClient.getRepo(settings.Repo, settings.Owner);

    return await this.repoRepository.saveRepo(
      this.mapRepoResponseToRepoInfo(repo),
    );
  }

  private mapRepoResponseToRepoInfo(repoResponse: RepoResponse): RepoInfo {
    return {
      id: repoResponse.id,
      name: repoResponse.name,
      createdAt: repoResponse.createdAt,
      updatedAt: repoResponse.updatedAt,
      url: repoResponse.url,
      description: repoResponse.description,
      forks: repoResponse.forks,
      language: repoResponse.language ?? "",
      stars: repoResponse.stars ?? 0,
      openIssues: repoResponse.openIssues ?? 0,
    };
  }
}

function initRepoController(
  redisClient: Redis,
  config: Config,
): RepoController {
  const repoRepository = new RepoRepository();
  const appSetting = new AppSettings(redisClient);
  const repoClient = new GithubRepo(
    config.githubBaseUrl,
    config.githubOwner,
    config.githubRepo,
    config.githubToken,
  );
  repoController = new RepoController(appSetting, repoRepository, repoClient);
  return repoController;
}

export function getRepoControllerInstance(
  redisClient?: Redis,
  config?: Config,
): RepoController {
  if (!repoController) {
    if (!redisClient || !config) {
      throw new Error("Redis client and config must be provided");
    }
    return initRepoController(redisClient!, config!);
  }
  return repoController;
}
