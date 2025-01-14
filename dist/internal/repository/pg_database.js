"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDataSource = initDataSource;
exports.getAppDataSourceInstance = getAppDataSourceInstance;
const typeorm_1 = require("typeorm");
const commit_entity_1 = require("../db/entities/commit_entity");
const repo_entity_1 = require("../db/entities/repo_entity");
let appDataSource;
function initDataSource(config) {
    const dataSource = new typeorm_1.DataSource({
        type: "postgres",
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        entities: [commit_entity_1.CommitInfo, repo_entity_1.RepoInfo],
        logging: true,
        synchronize: true,
    });
    appDataSource = dataSource;
    return appDataSource;
}
function getAppDataSourceInstance() {
    return appDataSource;
}
