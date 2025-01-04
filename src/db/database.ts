import { DataSource } from "typeorm";
import { CommitInfo } from "./entities/commit_entity";
import { RepoInfo } from "./entities/repo_entity";
import {config} from "../config/config"



export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    entities : [
CommitInfo,RepoInfo
    ],
    logging: true,
    synchronize: true
    
})