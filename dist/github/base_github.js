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
exports.BaseGithub = void 0;
class BaseGithub {
    constructor(baseUrl, owner, repo, token) {
        this.baseUrl = baseUrl;
        this.owner = owner;
        this.repo = repo;
        this.token = token;
    }
    makeRequest(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url, {
                method: "GET",
                headers,
            });
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            return response;
        });
    }
    getDefaultHeaders(token) {
        return new Headers({
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${token}`,
        });
    }
}
exports.BaseGithub = BaseGithub;
