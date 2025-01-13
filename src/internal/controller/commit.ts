import { GithubCommit } from "../../github/commit_service";
import { CommitInfo } from "../db/entities/commit_entity";

import { CommitRepository } from "../repository/commit";
import { Config, initConfig } from "../../internal/config/config";
import { getAppSettings, initAppSettings } from "../redis/redis";

enum constants {
  BATCHSIZE = 25,
}
export let commitCtrl: CommitController;
export class CommitController {
  commitRepo: CommitRepository;
  commitClient: GithubCommit;

  constructor(
    baseurl: string,
    owner: string,
    repo: string,
    startdate: string,
    pagesize: number,
    commitRepo?: CommitRepository,
    commitClient?: GithubCommit,
  ) {
    console.log("Starting CommitController initialization");
    const config = initConfig();
    console.log("Config initialized:", config);
    this.commitRepo = commitRepo || new CommitRepository();
    console.log("CommitRepo initialized:", this.commitRepo);
    this.commitClient =
      commitClient ||
      new GithubCommit(
        baseurl,
        owner,
        repo,
        config.githubToken,
        startdate,
        pagesize,
      );
    console.log("CommitClient initialized:", this.commitClient);
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
    const config = initConfig();
    // Track execution time for performance monitoring
    const startTime = performance.now();

    // Get application settings from Redis (includes repo, owner, start date)
    const appSetting = await getAppSettings(config);
    console.log("APP-SETTING", appSetting);
    try {
      // Get the most recent commit date to avoid fetching duplicate commits
      // Falls back to config.githubRepo(set in env) if appSetting.Repo(set in redis) is not available
      const lastCommitDate = await this.getLastCommitDate(
        appSetting.Repo ?? config.githubRepo,
      );
      console.log("Last commit date:", lastCommitDate);

      let page = 1;
      let allCommits: CommitInfo[] = [];

      // Set up batch processing to optimize memory usage and database operations
      const BATCH_SIZE = constants.BATCHSIZE; // Default is 25
      let batchCommits: CommitInfo[] = [];

      // Continue fetching commits until no more are available
      while (true) {
        // Fetch a page of commits from GitHub
        // Uses lastCommitDate from the database or StartDate as the starting point
        const commits = await this.commitClient.getCommits(
          page,
          lastCommitDate || appSetting.StartDate || undefined,
          appSetting.Repo || undefined,
          appSetting.Owner || undefined,
        );
        // Exit loop if no more commits are found
        if (!commits || commits.length === 0) break;

        // Convert raw commit data to CommitInfo instances
        // Uses Promise.all for parallel processing of commit data
        const commitInfos = await Promise.all(
          commits.map((commit) =>
            this.commitClient.getCommitInstance(commit, appSetting.Repo),
          ),
        );

        // Add processed commits to the current batch
        batchCommits.push(...commitInfos);

        // When batch size is reached, save to database and reset batch
        if (batchCommits.length >= BATCH_SIZE) {
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

      // Calculate and log execution metrics
      const executionTime = (performance.now() - startTime) / 1000;
      console.log(
        `!!! Scheduled job completed: ${allCommits.length} commits processed in ${executionTime.toFixed(2)} seconds`,
      );
      return allCommits;
    } catch (error) {
      // Error handling with type checking
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
    return await initAppSettings(repo, startDate, owner);
  }
}

export function initCommitController(config: Config): CommitController {
  commitCtrl = new CommitController(
    config.githubBaseUrl,
    config.githubOwner,
    config.githubRepo,
    config.startDate,
    config.githubPageSize,
  );
  return commitCtrl;
}
