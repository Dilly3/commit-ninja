"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubApiError = void 0;
class GitHubApiError extends Error {
    constructor(status, statusText) {
        super(`GitHub API error: ${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.name = 'GitHubApiError';
    }
}
exports.GitHubApiError = GitHubApiError;
