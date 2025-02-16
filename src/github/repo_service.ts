import { plainToInstance } from "class-transformer";
import { BaseGithub } from "./base_github";
import { RepoResponse } from "./models";

export class GithubRepo extends BaseGithub {
	constructor(baseUrl: string, owner: string, repo: string, token: string) {
		super(baseUrl, owner, repo, token);
	}
	async getRepo(repo: string, owner: string): Promise<RepoResponse> {
		const url = `${this.baseUrl}/repos/${owner}/${repo}`;
		const headers = this.getDefaultHeaders(this.token);
		try {
			const response = await this.makeRequest(url, headers);
			const repoResponse = await response.json();
			return this.mapRepoResponse(repoResponse);
		} catch (error) {
			console.error("Failed to fetch repo:", error);
			throw error;
		}
	}

	mapRepoResponse(repoObject: any): RepoResponse {
	 try {
		const repo = plainToInstance(RepoResponse, repoObject);
		return {
			id: repo.id,
			name: repo.name,
			createdAt: repo.createdAt,
			updatedAt: repo.updatedAt,
			url: repo.url,
			description: repo.description,
			forks: repo.forks,
			language: repo.language ? repo.language.toLowerCase() : "",
			stars: repo.stars,
			openIssues: repo.openIssues,
		};
	 }catch(e : any){
		if (e instanceof Error) {
			throw new Error("mapreporesponse error :" + e.message )
		}
		throw new Error("mapreporesponse error");
		
		
	 }
	}
}
