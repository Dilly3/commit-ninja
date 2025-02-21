import dotenv from "dotenv";

enum configDefaults {
  DefaultPageSize = 10,
  DefaultDBPORT = "5436",
  DefaultPostgresUser = "postgres",
  DefaultPostgresHost = "localhost",
  DefaultPostgresPassword = "postgres",
  DefaultAppPort = "7020",
  DefaultRedisPort = 6379,
  DefaultTimeZone = "Africa/Lagos",
  DefaultCronDelay = "5m",
  DefaultNodeEnv = "development",
}
dotenv.config();
let config: Config;
export class Config {
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
    public redisHost = process.env.REDIS_HOST ?? "localhost",
    public redisPort = process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT)
      : configDefaults.DefaultRedisPort,

    public startDate = process.env.GITHUB_START_DATE ?? "",
    public TZ = process.env.TZ ?? configDefaults.DefaultTimeZone,
    public cronDelay = process.env.CRON_DELAY ??
      configDefaults.DefaultCronDelay,
    public nodeEnv = process.env.NODE_ENV ?? configDefaults.DefaultNodeEnv,
  ) {}
}

export function initConfig(envPath: string): Config {
  dotenv.config({ path: envPath });
  config = new Config();
  return config;
}

export function getConfigInstance(): Config {
  return config;
}
