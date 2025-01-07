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
const commit_service_1 = require("../../github/commit_service");
const commit_1 = require("../repository/commit");
class CommitController {
    constructor(baseurl, owner, repo, token, startdate, pagesize, commitRepo = new commit_1.CommitRepository(), commitClient = new commit_service_1.GithubCommit(baseurl, owner, repo, token, startdate, pagesize)) {
        this.commitRepo = commitRepo;
        this.commitClient = commitClient;
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
    getLastCommitDate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commitRepo.getDateOfLastCommit();
        });
    }
    fetchAndSaveCommits() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastCommitDate = yield this.getLastCommitDate();
                console.log("Last commit date:", lastCommitDate);
                let page = 1;
                let allCommits = [];
                while (true) {
                    const commits = yield this.commitClient.getCommits(page, lastCommitDate || undefined);
                    if (!commits || commits.length === 0) {
                        break;
                    }
                    const commitInfos = yield Promise.all(commits.map((commit) => this.commitClient.getCommitInstance(commit)));
                    allCommits = [...allCommits, ...commitInfos];
                    page++;
                }
                const dbResults = yield this.saveCommits(allCommits);
                console.log(`Scheduled job completed: ${dbResults.length} commits processed`);
                return dbResults;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error(`unkwown error ${error}`);
            }
        });
    }
}
exports.CommitController = CommitController;
