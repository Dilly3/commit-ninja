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
exports.CommitController = void 0;
exports.getCommitControllerInstance = getCommitControllerInstance;
exports.initCommitController = initCommitController;
const commit_service_1 = require("../../github/commit_service");
const config_1 = require("../config/config");
const redis_1 = require("../redis/redis");
const commit_1 = require("../repository/commit");
var constants;
(function (constants) {
    constants[constants["BATCHSIZE"] = 25] = "BATCHSIZE";
})(constants || (constants = {}));
let commitController;
class CommitController {
    constructor(appSetting, commitRepo, commitClient, config, BATCH_SIZE) {
        var _a;
        if (config === void 0) { config = (0, config_1.getConfigInstance)(); }
        if (BATCH_SIZE === void 0) { BATCH_SIZE = ((_a = config.githubPageSize) !== null && _a !== void 0 ? _a : constants.BATCHSIZE) * 2; }
        this.appSetting = appSetting;
        this.commitRepo = commitRepo;
        this.commitClient = commitClient;
        this.config = config;
        this.BATCH_SIZE = BATCH_SIZE;
    }
    saveCommits(commits) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.commitRepo.saveCommits(commits);
        });
    }
    getCommits(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.commitRepo.getCommits(limit);
        });
    }
    getCommitsByAuthour(authorName, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.commitRepo.getCommitsByAuthor(authorName, limit);
        });
    }
    getAuthoursCommitCount(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commitRepo.getCommitCountsByAuthor(startDate, endDate);
        });
    }
    getLastCommitDate(repoName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commitRepo.getDateOfLastCommit(repoName);
        });
    }
    /**
     * Fetches commits from GitHub and saves them to the database in batches
     *
     * This function performs the following operations:
     * 1. Retrieves application settings from Redis
     * 2. Gets the date of the last saved commit to avoid duplicate fetching
     * 3. Iteratively fetches commits from GitHub API, processing them in batches
     * 4. Saves the commits to the database while maintaining memory efficiency
     *
     * @returns Promise<CommitInfo[]> Array of all processed commits
     * @throws Error if any operation fails during the process
     */
    fetchAndSaveCommits() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Track execution time for performance monitoring
            const startTime = performance.now();
            // Get application settings from Redis (includes repo, owner, start date)
            const appSetting = yield this.appSetting.getAppSettings(this.config);
            console.log("APP-SETTING", appSetting);
            try {
                // Get the most recent commit date to avoid fetching duplicate commits
                // Falls back to config.githubRepo(set in env) if appSetting.Repo(set in redis) is not available
                const lastCommitDate = yield this.getLastCommitDate((_a = appSetting.Repo) !== null && _a !== void 0 ? _a : this.config.githubRepo);
                console.log("Last commit date:", lastCommitDate);
                let page = 1;
                let allCommits = [];
                // Set up batch processing to optimize memory usage and database operations
                let batchCommits = [];
                // Continue fetching commits until no more are available
                while (true) {
                    // Fetch a page of commits from GitHub
                    // Uses lastCommitDate from the database or StartDate as the starting point
                    const commits = yield this.commitClient.getCommits(page, lastCommitDate || appSetting.StartDate || undefined, appSetting.Repo || undefined, appSetting.Owner || undefined);
                    // Exit loop if no more commits are found
                    if (!commits || commits.length === 0)
                        break;
                    // Convert raw commit data to CommitInfo instances
                    // Uses Promise.all for parallel processing of commit data
                    const commitInfos = yield Promise.all(commits.map((commit) => this.commitClient.getCommitInstance(commit, appSetting.Repo)));
                    // Add processed commits to the current batch
                    batchCommits.push(...commitInfos);
                    // When batch size is reached, save to database and reset batch
                    if (batchCommits.length >= this.BATCH_SIZE) {
                        yield this.saveCommits(batchCommits);
                        allCommits.push(...batchCommits);
                        batchCommits = [];
                    }
                    page++;
                }
                // Handle any remaining commits that didn't fill a complete batch
                if (batchCommits.length > 0) {
                    yield this.saveCommits(batchCommits);
                    allCommits.push(...batchCommits);
                }
                // Calculate and log execution metrics
                const executionTime = (performance.now() - startTime) / 1000;
                console.log(`!!! Scheduled job completed: ${allCommits.length} commits processed in ${executionTime.toFixed(2)} seconds`);
                return allCommits;
            }
            catch (error) {
                // Error handling with type checking
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error(`unknown error ${error}`);
            }
        });
    }
    setSetting(repo, startDate, cronDelay, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appSetting.initAppSettings(repo, startDate, cronDelay, owner);
        });
    }
}
exports.CommitController = CommitController;
function getCommitControllerInstance() {
    return commitController;
}
function initCommitController(redisClient, config) {
    const commitRepo = new commit_1.CommitRepository();
    const appSetting = new redis_1.AppSettings(redisClient);
    const commitClient = new commit_service_1.GithubCommit(config.githubBaseUrl, config.githubOwner, config.githubRepo, config.githubToken, config.startDate, config.githubPageSize);
    commitController = new CommitController(appSetting, commitRepo, commitClient);
    return commitController;
}
