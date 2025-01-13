import { Config } from "../config/config";
import { createClient } from "redis";
import { RedisClientType } from "@redis/client";
import { ApiError } from "../error/app_error";

export interface Setting {
  Repo: string;
  Owner: string;
  StartDate: string;
}

let redisClient: RedisClientType;

export async function initializeRedisClient(config: Config) {
  const redisUrl = `redis://${config.redisHost}:${config.redisPort}`;
  redisClient = createClient({ url: redisUrl });
  redisClient.on("error", (e) => {
    console.error("error initializing redis client");
    console.error(e);
  });

  try {
    redisClient.connect().then();
    console.log("redis client connection successful");
    return redisClient;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function initAppSettings(
  repo: string,
  startDate: string,
  owner?: string,
): Promise<boolean> {
  const isoDate = new Date(startDate).toISOString();
  console.log("ready to set settings with client::", typeof redisClient);
  // Build array of Redis operations
  const operations = [
    redisClient.set("repo", repo),
    redisClient.set("startDate", isoDate),
  ];

  if (owner) operations.push(redisClient.set("owner", owner));

  try {
    await Promise.all(operations);

    return true;
  } catch (error) {
    throw new ApiError("Failed to initialize app settings");
  }
}

export async function appSettings(config: Config): Promise<Setting> {
  try {
    const [owner, repo, startDate] = await Promise.all([
      redisClient.get("owner"),
      redisClient.get("repo"),
      redisClient.get("startDate"),
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

export async function getAppSettings(config: Config): Promise<Setting> {
  return await appSettings(config);
}
