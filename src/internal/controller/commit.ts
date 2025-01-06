import { CommitInfo } from "../db/entities/commit_entity";
import { CommitRepository } from "../repository/commit";

export class CommitController {
  constructor(public commitRepo = new CommitRepository()) {}

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
}

