import Redis from "ioredis";
import { config, Config } from "../config/config";
import { ApiError } from "../error/app_error";

export interface Setting {
  Repo: string;
  Owner: string;
  StartDate: string;
}

export class AppSettings {
  constructor(
    public redisInstance = new Redis({
      host: config.redisHost,
      port: config.redisPort,
    }),
  ) {}

  async InitAppSettings(
    repo: string,
    startDate: string,
    owner?: string,
  ): Promise<boolean> {
    const isoDate = new Date(startDate).toISOString();

    // Build array of Redis operations
    const operations = [
      this.redisInstance.set("repo", repo),
      this.redisInstance.set("startDate", isoDate),
    ];

    if (owner) operations.push(this.redisInstance.set("owner", owner));

    try {
      await Promise.all(operations);

      return true;
    } catch (error) {
      throw new ApiError("Failed to initialize app settings");
    }
  }

  private async appSettings(config: Config): Promise<Setting> {
    try {
      const [owner, repo, startDate] = await Promise.all([
        this.redisInstance.get("owner"),
        this.redisInstance.get("repo"),
        this.redisInstance.get("startDate"),
      ]);

      return {
        Owner: owner ?? config.githubOwner,
        Repo: repo ?? config.githubRepo,
        StartDate: startDate ?? config.startDate,
      };
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown Redis error");
    }
  }

  async getAppSettings(config: Config): Promise<Setting> {
    return await this.appSettings(config);
  }
}
