import { plainToInstance } from "class-transformer";
import { RepoResponse } from "./models";
import { BaseGithub } from "./base_github";

export class GithubRepo extends BaseGithub {
  constructor(baseUrl: string, owner: string, repo: string, token: string) {
    super(baseUrl, owner, repo, token);
  }
  async getRepo(
    repo: string = this.repo,
    owner: string = this.owner,
  ): Promise<RepoResponse> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}`;
    const headers = this.getDefaultHeaders(this.token);
    try {
      const response = await this.makeRequest(url, headers);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch repo:", error);
      throw error;
    }
  }

  getRepoInstance(repoObject: RepoResponse): RepoResponse {
    const repo = plainToInstance(RepoResponse, repoObject);
    return {
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
  }
}
