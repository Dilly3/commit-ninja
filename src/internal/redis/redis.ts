import Redis from "ioredis";
import { Config, getConfigInstance } from "../config/config";
import { ApiError } from "../error/app_error";

let defaultRedisClient: Redis | null = null;
export interface Setting {
	Repo: string;
	Owner: string;
	StartDate: string;
	CronDelay: string;
}

export class AppSettings {
	constructor(public redisInstance: Redis) {}

	async initAppSettings(
		repo: string,
		startDate: string,
		cronDelay?: string,
		owner?: string,
	): Promise<boolean> {
		const isoDate = new Date(startDate).toISOString();

		// Build array of Redis operations
		const operations = [
			this.redisInstance.set("repo", repo),
			this.redisInstance.set("startDate", isoDate),
		];

		if (cronDelay)
			operations.push(this.redisInstance.set("cronDelay", cronDelay));

		if (owner) operations.push(this.redisInstance.set("owner", owner));

		try {
			await Promise.all(operations);

			return true;
		} catch (error) {
			throw new ApiError("Failed to initialize app settings");
		}
	}

	private async loadappSettings(config: Config): Promise<Setting> {
		try {
			const [owner, repo, startDate, cronDelay] = await Promise.all([
				this.redisInstance.get("owner"),
				this.redisInstance.get("repo"),
				this.redisInstance.get("startDate"),
				this.redisInstance.get("cronDelay"),
			]);

			return {
				Owner: owner ?? config.githubOwner,
				Repo: repo ?? config.githubRepo,
				StartDate: startDate ?? config.startDate,
				CronDelay: cronDelay ?? config.cronDelay,
			};
		} catch (err) {
			throw err instanceof Error ? err : new Error("Unknown Redis error");
		}
	}

	async getAppSettings(config: Config): Promise<Setting> {
		return await this.loadappSettings(config);
	}
}

function initRedis(): Redis {
	const config = getConfigInstance();
	const redisClient = new Redis({
		host: config.redisHost,
		port: config.redisPort,
		// Add retry strategy
		retryStrategy: (times) => {
			const delay = Math.min(times * 50, 2000);
			return delay;
		},
	});

	// 2. Handle Redis events properly
	redisClient.on("error", (err) => {
		console.error("Redis Client Error:", err);
		throw err;
	});

	redisClient.on("connect", () => {
		console.log("Redis Client Connected");
		defaultRedisClient = redisClient;
	});
	
	redisClient.on("ready", () => {
		console.log("Redis Client Ready");
  });

	return redisClient;
}

export function getRedisInstance(): Redis {
	if (!defaultRedisClient) {
		defaultRedisClient = initRedis();
	}

	return defaultRedisClient;
}
