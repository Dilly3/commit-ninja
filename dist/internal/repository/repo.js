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
exports.RepoRepository = void 0;
const repo_entity_1 = require("./../db/entities/repo_entity");
const pg_database_1 = require("./pg_database");
class RepoRepository {
    constructor(RepoReposit = pg_database_1.AppDataSource.getRepository(repo_entity_1.RepoInfo)) {
        this.RepoReposit = RepoReposit;
    }
    getRepoByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.RepoReposit.findOne({
                where: {
                    name: name,
                },
            });
        });
    }
    getReposWithMostStars() {
        return __awaiter(this, arguments, void 0, function* (limit = 1) {
            const query = this.RepoReposit.createQueryBuilder("repo")
                .select(["repo.name", "repo.url", "repo.stars"])
                .orderBy("repo.stars", "DESC");
            if (limit) {
                query.limit(limit);
            }
            const repos = yield query.getMany();
            return repos.map((repo) => ({
                name: repo.name,
                url: repo.url,
                stars: repo.stars,
            }));
        });
    }
}
exports.RepoRepository = RepoRepository;
