import { CommitResponse } from "./models";
import { GitHubApiError } from "./github_error";
import { BaseGithub } from "./base_github";

export class GithubCommit extends BaseGithub {
  constructor(
    baseUrl: string,
    owner: string,
    repo: string,
    token: string,
    private startDate: string,
    private pageSize: number,
  ) {
    super(baseUrl, owner, repo, token);
  }

  getRepoName(): string {
    return this.repo;
  }

  async getCommits(
    page: number = 1,
    since?: string,
    repo?: string,
    owner?: string,
  ): Promise<CommitResponse[]> {
    const url = this.parseCommitUrl(
      since || this.startDate,
      page,
      repo || this.repo,
      owner || this.owner,
    );
    const headers = this.getDefaultHeaders(this.token);

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
  /**
   * Converts a raw GitHub commit response into a normalized CommitInfo object
   * @param repoCommit - The raw commit response from GitHub's API
   * @param repoName - Optional repository name override. If not provided, uses the instance's repo name
   * @returns {CommitInfo} A normalized commit information object containing essential commit details
   */
  // getCommitInstance(repoCommit: CommitResponse, repoName?: string): CommitInfo {
  //   const commit = plainToInstance(CommitResponse, repoCommit);
  //   return {
  //     id: commit.sha,
  //     repoName: repoName || this.repo,
  //     message: commit.commit.message,
  //     authorName: commit.committer.login,
  //     authorEmail: commit.commit.author.email,
  //     date: commit.commit.author.date,
  //     url: commit.commit.url.split("/git/")[0],
  //   };
  // }

  private parseCommitUrl(
    since: string,
    page: number,
    repo?: string,
    owner?: string,
  ): string {
    return `${this.baseUrl}/repos/${owner}/${repo}/commits?since=${since}&per_page=${this.pageSize}&page=${page}`;
  }
}
