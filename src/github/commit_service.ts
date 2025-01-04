import { plainToInstance } from "class-transformer";
import { CommitInfo, CommitResponse } from "./models";
import { GitHubApiError } from "./github_error";
import { BaseGithub } from "./base_github";

export class GithubCommit extends BaseGithub {
  constructor(
    baseUrl: string,
    owner: string,
    repo: string,
    token: string,
    private startDate: string
  ) {
    super(baseUrl, owner, repo, token);
  }

  async getCommits(
    page: number = 1,
    since: string = this.startDate,
    perPage: number = 20
  ): Promise<CommitResponse[]> {
    const url = this.parseCommitUrl(since, perPage, page);
    const headers = this.getDefaultHeaders();

    try {
      const response = await this.makeRequest(url, headers);
      const commits: CommitResponse[] = await response.json();
      return commits;
    } catch (error) {
      console.error("Failed to fetch commits:", error);
      throw error instanceof GitHubApiError
        ? error
        : new Error("Failed to fetch commits");
    }
  }

  getCommitInstance(repoCommit: CommitResponse): CommitInfo {
    const commit = plainToInstance(CommitResponse, repoCommit);
    return {
      id: commit.sha,
      repoName: this.repo,
      message: commit.commit.message,
      authorName: commit.committer.login,
      authorEmail: commit.commit.author.email,
      date: commit.commit.author.date,
      url: commit.commit.url.split("/git/")[0],
    };
  }

  private parseCommitUrl(since: string, perPage: number, page: number): string {
    return `${this.baseUrl}/repos/${this.owner}/${this.repo}/commits?since=${since}&per_page=${perPage}&page=${page}`;
  }
} 