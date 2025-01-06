import dotenv from "dotenv";

enum configDefaults {
  DefaultPageSize = 10,
  DefaultDBPORT = "5436",
  DefaultPostgresUser = "postgres",
  DefaultPostgresHost = "localhost",
  DefaultPostgresPassword = "postgres",
  DefaultAppPort = "7020",
}
dotenv.config();
class Config {
  constructor(
    public port = process.env.PORT ?? configDefaults.DefaultAppPort,
    public dbPort = parseInt(
      process.env.DB_PORT ?? configDefaults.DefaultDBPORT,
    ),
    public dbHost = process.env.DB_HOST ?? configDefaults.DefaultPostgresHost,
    public dbUser = process.env.DB_USER ?? configDefaults.DefaultPostgresUser,
    public dbPassword = process.env.DB_PASSWORD ??
      configDefaults.DefaultPostgresPassword,
    public dbName = process.env.DB_NAME ?? "commit_ninja",
    public githubBaseUrl = process.env.GITHUB_BASE_URL ?? "",
    public githubToken = process.env.GITHUB_TOKEN ?? "",
    public githubOwner = process.env.GITHUB_OWNER ?? "",
    public githubRepo = process.env.GITHUB_REPO ?? "",
    public githubPageSize = process.env.PAGE_SIZE
      ? parseInt(process.env.PAGE_SIZE)
      : configDefaults.DefaultPageSize,
    public startDate = process.env.GITHUB_START_DATE ?? "",
  ) {}
}

export const config = new Config();
