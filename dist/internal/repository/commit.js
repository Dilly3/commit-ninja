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
exports.CommitRepository = void 0;
const pg_database_1 = require("./pg_database");
const commit_entity_1 = require("../db/entities/commit_entity");
const paginator_1 = require("../paginator/paginator");
const chalk_1 = __importDefault(require("chalk"));
class CommitRepository {
    constructor(commitReposit = pg_database_1.AppDataSource.getRepository(commit_entity_1.CommitInfo)) {
        this.commitReposit = commitReposit;
    }
    saveCommit(commitInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for existing commit with the same ID
            const existingCommit = yield this.commitReposit.findOne({
                where: { id: commitInfo.id },
            });
            if (existingCommit) {
                return existingCommit; // Return existing commit if found
            }
            // Save and return the new commit
            return yield this.commitReposit.save(commitInfo);
        });
    }
    saveCommits(commitInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedCommits = [];
            for (const commitInfo of commitInfos) {
                // Check for existing commit with the same ID
                const existingCommit = yield this.commitReposit.findOne({
                    where: { id: commitInfo.id },
                });
                if (existingCommit) {
                    savedCommits.push(existingCommit);
                }
                else {
                    // Save and return the new commit
                    const savedCommit = yield this.commitReposit.save(commitInfo);
                    savedCommits.push(savedCommit);
                }
            }
            return savedCommits;
        });
    }
    getCommits(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.commitReposit
                .createQueryBuilder("commitinfo")
                .orderBy("commitinfo.date", "DESC");
            if (limit) {
                query.take(limit);
            }
            const paginator = (0, paginator_1.BuildPaginator)(commit_entity_1.CommitInfo, paginator_1.Order.DESC, limit !== null && limit !== void 0 ? limit : 10);
            const { data, cursor: newCursor } = yield paginator.paginate(query);
            const page = {
                data,
                cursor: newCursor,
            };
            return page;
        });
    }
    getCommitsByAuthor(authorName, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.commitReposit
                .createQueryBuilder("commit")
                .where("commit.author_name = :authorName", { authorName })
                .orderBy("commit.timestamp", "DESC");
            if (limit) {
                query.take(limit);
            }
            return yield query.getMany();
        });
    }
    getCommitsByEmail(authorEmail, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.commitReposit
                .createQueryBuilder("commit")
                .where("commit.author_email = :authorEmail", { authorEmail })
                .orderBy("commit.timestamp", "DESC");
            if (limit) {
                query.take(limit);
            }
            return yield query.getMany();
        });
    }
    getCommitCountsByAuthor(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.commitReposit
                .createQueryBuilder("commit")
                .select("commit.author_email", "author_email")
                .addSelect("commit.author_name", "author_name")
                .addSelect("COUNT(*)", "commit_count");
            if (startDate) {
                const sd = new Date(startDate).toISOString();
                query.andWhere("commit.date >= :startDate", { sd });
            }
            if (endDate) {
                const ed = new Date(endDate).toISOString();
                query.andWhere("commit.date <= :endDate", { ed });
            }
            return yield query
                .groupBy("commit.author_email")
                .addGroupBy("commit.author_name")
                .orderBy("commit_count", "DESC")
                .getRawMany();
        });
    }
    getDateOfLastCommit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mostRecentCommit = yield this.commitReposit
                    .createQueryBuilder("commit")
                    .select("commit.date")
                    .orderBy("commit.date", "DESC")
                    .limit(1)
                    .getOne();
                console.log(chalk_1.default.blue("Most recent commit found:", mostRecentCommit)); // Debug log
                if (!mostRecentCommit) {
                    console.log(chalk_1.default.red("No commits found in database")); // Debug log
                    return null;
                }
                if (!mostRecentCommit.date) {
                    console.log(chalk_1.default.red("Most recent commit has no date")); // Debug log
                    return null;
                }
                return mostRecentCommit.date;
            }
            catch (error) {
                console.error("Error fetching last commit date:", error); // Error log
                throw error;
            }
        });
    }
}
exports.CommitRepository = CommitRepository;
