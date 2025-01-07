"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const commit_entity_1 = require("../db/entities/commit_entity");
const repo_entity_1 = require("../db/entities/repo_entity");
const config_1 = require("../config/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: config_1.config.dbHost,
    port: config_1.config.dbPort,
    username: config_1.config.dbUser,
    password: config_1.config.dbPassword,
    database: config_1.config.dbName,
    entities: [commit_entity_1.CommitInfo, repo_entity_1.RepoInfo],
    logging: true,
    synchronize: true,
});
