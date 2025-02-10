const APPLICATIONJSON = "application/json";
const GITHUB_API_VERSION_DATE = "2022-11-28";
export abstract class BaseGithub {
  constructor(
    protected baseUrl: string,
    protected owner: string,
    protected repo: string,
    protected token: string,
  ) {}

  protected async makeRequest(
    url: string,
    headers: Headers,
  ): Promise<Response> {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }
    return response;
  }

  protected getDefaultHeaders(token: string): Headers {
    return new Headers({
      "Content-Type": APPLICATIONJSON,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": GITHUB_API_VERSION_DATE,
      Authorization: `Bearer ${token}`,
    });
  }
}
