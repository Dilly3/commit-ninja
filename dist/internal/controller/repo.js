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
exports.RepoController = void 0;
exports.getRepoControllerInstance = getRepoControllerInstance;
const class_transformer_1 = require("class-transformer");
const redis_1 = require("../redis/redis");
const repo_1 = require("../repository/repo");
const config_1 = require("../config/config");
const repo_service_1 = require("../../github/repo_service");
const repo_entity_1 = require("../db/entities/repo_entity");
let repoController = null;
class RepoController {
    constructor(appSetting, repoRepository, repoClient, config = (0, config_1.getConfigInstance)()) {
        this.appSetting = appSetting;
        this.repoRepository = repoRepository;
        this.repoClient = repoClient;
        this.config = config;
    }
    getRepoByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repoRepository.getRepoByName(name);
        });
    }
    getRepoByLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            const repos = yield this.repoRepository.getRepoByLanguage(language);
            return (0, class_transformer_1.plainToInstance)(repo_entity_1.RepoInfo, repos);
        });
    }
    getReposWithMostStars() {
        return __awaiter(this, arguments, void 0, function* (limit = 1) {
            return yield this.repoRepository.getReposWithMostStars(limit);
        });
    }
    setSetting(repo, startDate, cronDelay, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appSetting.initAppSettings(repo, startDate, cronDelay, owner);
        });
    }
    fetchAndSaveRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield this.appSetting.getAppSettings(this.config);
            const repo = yield this.repoClient.getRepo(settings.Repo, settings.Owner);
            return yield this.repoRepository.saveRepo(this.mapRepoResponseToRepoInfo(repo));
        });
    }
    mapRepoResponseToRepoInfo(repoResponse) {
        var _a, _b, _c;
        return {
            id: repoResponse.id,
            name: repoResponse.name,
            createdAt: repoResponse.createdAt,
            updatedAt: repoResponse.updatedAt,
            url: repoResponse.url,
            description: repoResponse.description,
            forks: repoResponse.forks,
            language: (_a = repoResponse.language) !== null && _a !== void 0 ? _a : "",
            stars: (_b = repoResponse.stars) !== null && _b !== void 0 ? _b : 0,
            openIssues: (_c = repoResponse.openIssues) !== null && _c !== void 0 ? _c : 0,
        };
    }
}
exports.RepoController = RepoController;
function initRepoController(redisClient, config) {
    const repoRepository = new repo_1.RepoRepository();
    const appSetting = new redis_1.AppSettings(redisClient);
    const repoClient = new repo_service_1.GithubRepo(config.githubBaseUrl, config.githubOwner, config.githubRepo, config.githubToken);
    repoController = new RepoController(appSetting, repoRepository, repoClient);
    return repoController;
}
function getRepoControllerInstance(redisClient, config) {
    if (!repoController) {
        if (!redisClient || !config) {
            throw new Error("Redis client and config must be provided");
        }
        return initRepoController(redisClient, config);
    }
    return repoController;
}
