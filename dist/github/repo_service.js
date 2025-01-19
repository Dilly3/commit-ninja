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
exports.GithubRepo = void 0;
const class_transformer_1 = require("class-transformer");
const base_github_1 = require("./base_github");
const models_1 = require("./models");
class GithubRepo extends base_github_1.BaseGithub {
    constructor(baseUrl, owner, repo, token) {
        super(baseUrl, owner, repo, token);
    }
    getRepo(repo, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/repos/${owner}/${repo}`;
            const headers = this.getDefaultHeaders(this.token);
            try {
                const response = yield this.makeRequest(url, headers);
                const repoResponse = yield response.json();
                return this.getRepoInstance(repoResponse);
            }
            catch (error) {
                console.error("Failed to fetch repo:", error);
                throw error;
            }
        });
    }
    getRepoInstance(repoObject) {
        const repo = (0, class_transformer_1.plainToInstance)(models_1.RepoResponse, repoObject);
        return {
            id: repo.id,
            name: repo.name,
            createdAt: repo.createdAt,
            updatedAt: repo.updatedAt,
            url: repo.url,
            description: repo.description,
            forks: repo.forks,
            language: repo.language,
            stars: repo.stars,
            openIssues: repo.openIssues,
        };
    }
}
exports.GithubRepo = GithubRepo;
