import { CommitResponse } from "./models";
import dotenv from "dotenv"
dotenv.config()
export class GithubClient{

    private readonly owner: string;
    readonly repo: string;
    private readonly baseUrl: string;
    private readonly token: string;

    constructor({
        owner = process.env.OWNER ?? "",
        repo = process.env.REPO ?? "",
        baseUrl = process.env.BASE_URL ?? "",
        token = process.env.GITHUB_TOKEN ?? ""
    } = {}) {
        this.owner = owner;
        this.repo = repo;
        this.baseUrl = baseUrl;
        this.token = token;
    }


    async getRepo(since: string, perPage: number = 10, page: number = 1): Promise<CommitResponse[]> {
        const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/commits?since=${since}&per_page=${perPage}&page=${page}`
        const headers = this.getDefaultHeaders();

        try {
            const response = await this.makeRequest(url, headers);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch commits:', error);
            throw error;
        }
    }


    private async makeRequest(url: string, headers: Headers): Promise<Response> {
        const response = await fetch(url, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return response;
    }

    private getDefaultHeaders(): Headers {
        return new Headers({
            "Content-Type": "application/json",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": `Bearer ${this.token}`
        });
    }

}