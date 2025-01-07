import { GithubCommit } from "../../github/commit_service";
import { CommitInfo } from "../db/entities/commit_entity";
import { CommitRepository } from "../repository/commit";

export class CommitController {
  constructor(
    baseurl: string,
    owner: string,
    repo: string,
    token: string,
    startdate: string,
    pagesize: number,

    private commitRepo = new CommitRepository(),

    public commitClient = new GithubCommit(
      baseurl,
      owner,
      repo,
      token,
      startdate,
      pagesize,
    ),
  ) {}

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

  async getLastCommitDate() {
    return this.commitRepo.getDateOfLastCommit();
  }

  async fetchAndSaveCommits(): Promise<CommitInfo[]> {
    try {
      const lastCommitDate = await this.getLastCommitDate();
      console.log("Last commit date:", lastCommitDate);
      let page = 1;
      let allCommits: CommitInfo[] = [];

      while (true) {
        const commits = await this.commitClient.getCommits(
          page,
          lastCommitDate || undefined,
        );
        if (!commits || commits.length === 0) {
          break;
        }
        const commitInfos = await Promise.all(
          commits.map((commit) => this.commitClient.getCommitInstance(commit)),
        );
        allCommits = [...allCommits, ...commitInfos];
        page++;
      }
      const dbResults = await this.saveCommits(allCommits);
      console.log(
        `Scheduled job completed: ${dbResults.length} commits processed`,
      );
      return dbResults;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`unkwown error ${error}`);
    }
  }
}
