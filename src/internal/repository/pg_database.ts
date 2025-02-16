import { Config } from "./../config/config";
import { DataSource } from "typeorm";
import { CommitInfo } from "../db/entities/commit_entity";
import { RepoInfo } from "../db/entities/repo_entity";

let appDataSource: DataSource;

export function initDataSource(config: Config): DataSource {
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
  appDataSource
    .initialize()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err: Error) => {
      console.error("Error connecting to DB:", err);
    });
  return appDataSource;
}

export function getAppDataSourceInstance(): DataSource {
  return appDataSource;
}
