"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubCommit = void 0;
const class_transformer_1 = require("class-transformer");
const models_1 = require("./models");
const github_error_1 = require("./github_error");
const base_github_1 = require("./base_github");
class GithubCommit extends base_github_1.BaseGithub {
    constructor(baseUrl, owner, repo, token, startDate, pageSize) {
        super(baseUrl, owner, repo, token);
        this.startDate = startDate;
        this.pageSize = pageSize;
    }
    getCommits() {
        return __awaiter(this, arguments, void 0, function* (page = 1, since) {
            const url = this.parseCommitUrl(since || this.startDate, page);
            const headers = this.getDefaultHeaders();
            try {
                const response = yield this.makeRequest(url, headers);
                const commits = yield response.json();
                return commits;
            }
            catch (error) {
                console.error("Failed to fetch commits:", error);
                throw error instanceof github_error_1.GitHubApiError
                    ? error
                    : new Error("Failed to fetch commits");
            }
        });
    }
    getCommitInstance(repoCommit) {
        const commit = (0, class_transformer_1.plainToInstance)(models_1.CommitResponse, repoCommit);
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
    parseCommitUrl(since, page) {
        return `${this.baseUrl}/repos/${this.owner}/${this.repo}/commits?since=${since}&per_page=${this.pageSize}&page=${page}`;
    }
}
exports.GithubCommit = GithubCommit;
