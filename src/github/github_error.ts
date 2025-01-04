

export class GitHubApiError extends Error {
    constructor(public status: number, public statusText: string) {
      super(`GitHub API error: ${status} ${statusText}`);
      this.name = 'GitHubApiError';
    }
  }

