import { plainToInstance } from "class-transformer";
import { CommitInfo, CommitResponse, RepoResponse } from "./models";
import { GitHubApiError } from "./github_error";

export class GithubHttp {
  constructor(
    private startDate: string,
    private baseUrl: string,
    private owner: string,
    private repo: string,
    private token: string
  ) {}
  // getCommits
  async getCommits(
     page: number = 1,
    since: string = this.startDate,
    perPage: number = 10,
   
  ): Promise<CommitResponse[]> {
    const url = this.parseCommitURl(
        this.baseUrl,
        this.owner,
        this.repo,
        since,perPage,page   
    )
    const headers = this.getDefaultHeaders();

    try {
      const response = await this.makeRequest(url, headers);
      const commits : CommitResponse[] = await response.json();
      return commits
    } catch (error) {
      console.error("Failed to fetch commits:", error);
      throw error instanceof GitHubApiError
        ? error
        : new Error("Failed to fetch commits");
    }
  }

  async getRepo(
    repo: string = this.repo,
    owner: string = this.owner
  ): Promise<RepoResponse> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}`;
    const headers = this.getDefaultHeaders();
    try {
      const response = await this.makeRequest(url, headers);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch commits:", error);
      throw error;
    }
  }

  private async makeRequest(
    url: string, 
    headers: Headers
): Promise<Response> {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }
    return response;
  }

  private getDefaultHeaders()
  : Headers {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${this.token}`,
    });
  }

  getCommitInstance(repoCommit: CommitResponse): CommitInfo {
    const commit = plainToInstance(CommitResponse, repoCommit);
    const commitInfo: CommitInfo = {
      id: commit.sha,
      repoName: this.repo,
      message: commit.commit.message,
      authorName: commit.committer.login,
      authorEmail: commit.commit.author.email,
      date: commit.commit.author.date,
      url: commit.commit.url.split("/git/")[0],
    };
    return commitInfo;
  }

  getRepoInstance(repoObject: RepoResponse): RepoResponse {
    const repo = plainToInstance(RepoResponse, repoObject);
    const repoInfo = {
      id: repo.id,
      name: repo.name,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      url: repo.url,
      description: repo.description,
      forks: repo.forks,
      language: repo.language,
      size: repo.size,
    };
    return repoInfo;
  }

  private parseCommitURl(
    url: string, 
    owner : string, 
    repo : string, 
    since : string, 
    perPage : number, 
    page : number) : string{
    return `${url}/repos/${owner}/${repo}` +
    `/commits?since=${since}&per_page=` +
    `${perPage}&page=${page}`;
  }
}
