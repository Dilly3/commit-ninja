import { GithubCommit } from "../../github/commit_service";
import { CommitInfo } from "../db/entities/commit_entity";
import { AppSettings } from "../redis/redis";
import { CommitRepository } from "../repository/commit";
import { config } from "../../internal/config/config";

enum constants {
  BATCHSIZE = 25,
}
export class CommitController {
  commitRepo: CommitRepository;
  commitClient: GithubCommit;
  redisInstance: AppSettings;
  constructor(
    baseurl: string,
    owner: string,
    repo: string,
    token: string,
    startdate: string,
    pagesize: number,
    commitRepo?: CommitRepository,
    redisInstance?: AppSettings,
    commitClient?: GithubCommit,
  ) {
    this.commitRepo = commitRepo || new CommitRepository();
    this.redisInstance = redisInstance || new AppSettings();
    this.commitClient =
      commitClient ||
      new GithubCommit(baseurl, owner, repo, token, startdate, pagesize);
  }

  async saveCommits(commits: CommitInfo[]) {
    return await this.commitRepo.saveCommits(commits);
  }

  async getCommits(limit?: number) {
    return await this.commitRepo.getCommits(limit);
  }

  async getCommitsByAuthour(
    authorName: string,
    limit?: number,
  ): Promise<CommitInfo[]> {
    return await this.commitRepo.getCommitsByAuthor(authorName, limit);
  }
  async getAuthoursCommitCount(startDate?: string, endDate?: string) {
    return this.commitRepo.getCommitCountsByAuthor(startDate, endDate);
  }

  async getLastCommitDate(repoName?: string) {
    return this.commitRepo.getDateOfLastCommit(repoName);
  }

  async fetchAndSaveCommits(): Promise<CommitInfo[]> {
    const startTime = performance.now();

    const appSetting = await this.redisInstance.getAppSettings(config);
    console.log("APP-SETTING", appSetting);
    try {
      const lastCommitDate = await this.getLastCommitDate(
        appSetting.Repo ?? config.githubRepo,
      );
      console.log("Last commit date:", lastCommitDate);
      let page = 1;
      let allCommits: CommitInfo[] = [];

      // Process commits in batches
      const BATCH_SIZE = constants.BATCHSIZE;
      let batchCommits: CommitInfo[] = [];

      while (true) {
        const commits = await this.commitClient.getCommits(
          page,
          lastCommitDate || appSetting.StartDate || undefined,
          appSetting.Repo || undefined,
          appSetting.Owner || undefined,
        );
        if (!commits || commits.length === 0) break;

        // Process commits in parallel but with controlled concurrency
        const commitInfos = await Promise.all(
          commits.map((commit) =>
            this.commitClient.getCommitInstance(commit, appSetting.Repo),
          ),
        );

        batchCommits.push(...commitInfos);

        // Save to DB when batch size is reached
        if (batchCommits.length >= BATCH_SIZE) {
          await this.saveCommits(batchCommits);
          allCommits.push(...batchCommits);
          batchCommits = [];
        }

        page++;
      }

      // Save any remaining commits
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
    owner: string,
  ): Promise<boolean> {
    return await this.redisInstance.InitAppSettings(repo, startDate, owner);
  }
}
