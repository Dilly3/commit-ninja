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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GithubClient {
    constructor(_a) {
        var _b, _c, _d, _e;
        var { owner = (_b = process.env.OWNER) !== null && _b !== void 0 ? _b : "", repo = (_c = process.env.REPO) !== null && _c !== void 0 ? _c : "", baseUrl = (_d = process.env.BASE_URL) !== null && _d !== void 0 ? _d : "", token = (_e = process.env.GITHUB_TOKEN) !== null && _e !== void 0 ? _e : "" } = _a === void 0 ? {} : _a;
        this.owner = owner;
        this.repo = repo;
        this.baseUrl = baseUrl;
        this.token = token;
    }
    getRepo(since_1) {
        return __awaiter(this, arguments, void 0, function* (since, perPage = 10, page = 1) {
            const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/commits?since=${since}&per_page=${perPage}&page=${page}`;
            const headers = this.getDefaultHeaders();
            try {
                const response = yield this.makeRequest(url, headers);
                return yield response.json();
            }
            catch (error) {
                console.error('Failed to fetch commits:', error);
                throw error;
            }
        });
    }
    makeRequest(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url, {
                method: 'GET',
                headers
            });
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            return response;
        });
    }
    getDefaultHeaders() {
        return new Headers({
            "Content-Type": "application/json",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": `Bearer ${this.token}`
        });
    }
}
exports.GithubClient = GithubClient;
