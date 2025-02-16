import { Redis } from "ioredis";
import { GithubCommit } from "../../github/commit_service";
import { Config, getConfigInstance } from "../config/config";
import { CommitInfo } from "../db/entities/commit_entity";
import { AppSettings } from "../redis/redis";
import { CommitResponse } from "../../github/models";
import { ICommitRepository } from "../repository/commit";
import { plainToInstance } from "class-transformer";

enum constants {
  BATCHSIZE = 25,
}

let commitController: CommitController;
export class CommitController {
  constructor(
    public appSetting: AppSettings,
    public commitRepo: ICommitRepository,
    public commitClient: GithubCommit,
    public config = getConfigInstance(),
    private readonly BATCH_SIZE: number = (config.githubPageSize ??
      constants.BATCHSIZE) * 2,
  ) {}

  async saveCommits(commits: CommitInfo[]) {
    return await this.commitRepo.saveCommits(commits);
  }

  async getCommits(limit?: number) {
    return await this.commitRepo.getCommits(limit);
  }

  async getAuthoursCommitCount(startDate?: string, endDate?: string) {
    return this.commitRepo.getCommitCountsByAuthor(startDate, endDate);
  }

  async getLastCommitDate(repoName?: string) {
    return this.commitRepo.getDateOfLastCommit(repoName);
  }

  /**
   * Fetches commits from GitHub and saves them to the database in batches
   *
   * This function performs the following operations:
   * 1. Retrieves application settings from Redis
   * 2. Gets the date of the last saved commit to avoid duplicate fetching
   * 3. Iteratively fetches commits from GitHub API, processing them in batches
   * 4. Saves the commits to the database while maintaining memory efficiency
   *
   * @returns Promise<CommitInfo[]> Array of all processed commits
   * @throws Error if any operation fails during the process
   */
  async fetchAndSaveCommits(): Promise<CommitInfo[]> {
    const startTime = performance.now();

    const appSetting = await this.appSetting.getAppSettings(this.config);
    console.log("APP-SETTING", appSetting);
    try {
      const lastCommitDate = await this.getLastCommitDate(
        appSetting.Repo ?? this.config.githubRepo,
      );
      console.log("Last commit date:", lastCommitDate);

      let page = 1;
      let allCommits: CommitInfo[] = [];

      let batchCommits: CommitInfo[] = [];

      // Continue fetching commits until no more are available
      while (true) {
        const commits = await this.commitClient.getCommits(
          page,
          lastCommitDate || appSetting.StartDate || undefined,
          appSetting.Repo || undefined,
          appSetting.Owner || undefined,
        );
        // Exit loop if no more commits are found
        if (!commits || commits.length === 0) break;

        const commitInfos = await Promise.all(
          commits.map((commit) =>
            this.getCommitInstance(commit, appSetting.Repo),
          ),
        );

        batchCommits.push(...commitInfos);

        // When batch size is reached, save to database and reset batch
        if (batchCommits.length >= this.BATCH_SIZE) {
          await this.saveCommits(batchCommits);
          allCommits.push(...batchCommits);
          batchCommits = [];
        }

        page++;
      }

      // Handle any remaining commits that didn't fill a complete batch
      if (batchCommits.length > 0) {
        await this.saveCommits(batchCommits);
        allCommits.push(...batchCommits);
      }

      const executionTime = (performance.now() - startTime) / 1000;
      console.log(
        `!!! Scheduled job completed: ${allCommits.length} commits processed in ${executionTime.toFixed(2)} seconds`,
      );
      return allCommits;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`unknown error ${error}`);
    }
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

  getCommitInstance(repoCommit: CommitResponse, repoName?: string): CommitInfo {
    const commit = plainToInstance(CommitResponse, repoCommit);
    return {
      id: commit.sha,
      repoName: repoName || this.commitClient.getRepoName(),
      message: commit.commit.message,
      authorName: commit.committer.login,
      authorEmail: commit.commit.author.email,
      date: commit.commit.author.date,
      url: commit.commit.url.split("/git/")[0],
    };
  }
}

export function getCommitControllerInstance(): CommitController {
  if (!commitController) {
    throw new Error("CommitController not initialized");
  }
  return commitController;
}

export function initCommitController(
  redisClient: Redis,
  config: Config,
  commitDB: ICommitRepository,
): CommitController {
  const commitRepo = commitDB;
  const appSetting = new AppSettings(redisClient);
  const commitClient = new GithubCommit(
    config.githubBaseUrl,
    config.githubOwner,
    config.githubRepo,
    config.githubToken,
    config.startDate,
    config.githubPageSize,
  );
  commitController = new CommitController(appSetting, commitRepo, commitClient);
  return commitController;
}
