export abstract class BaseGithub {
  constructor(
    protected baseUrl: string,
    protected owner: string,
    protected repo: string,
    protected token: string
  ) {}

  protected async makeRequest(url: string, headers: Headers): Promise<Response> {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response;
  }

  protected getDefaultHeaders(): Headers {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${this.token}`,
    });
  }
} 