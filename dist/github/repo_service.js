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
const models_1 = require("./models");
const base_github_1 = require("./base_github");
class GithubRepo extends base_github_1.BaseGithub {
    getRepo() {
        return __awaiter(this, arguments, void 0, function* (repo = this.repo, owner = this.owner) {
            const url = `${this.baseUrl}/repos/${owner}/${repo}`;
            const headers = this.getDefaultHeaders();
            try {
                const response = yield this.makeRequest(url, headers);
                return yield response.json();
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
            size: repo.size,
        };
    }
}
exports.GithubRepo = GithubRepo;
