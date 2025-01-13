import { Config } from "./../config/config";
import { DataSource } from "typeorm";
import { CommitInfo } from "../db/entities/commit_entity";
import { RepoInfo } from "../db/entities/repo_entity";

export let appDataSource: DataSource;
export function setupDataSource(config: Config): DataSource {
  const dataSource = new DataSource({
    type: "postgres",
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    entities: [CommitInfo, RepoInfo],
    logging: true,
    synchronize: true,
  });
  appDataSource = dataSource;
  return dataSource;
}
