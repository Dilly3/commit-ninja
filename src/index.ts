import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./internal/repository/pg_database";
import { config } from "./internal/config/config";

import bodyParser from "body-parser";
import Cors from "cors";
import { ApiError } from "./internal/error/app_error";
//import { CommitController } from "./internal/controller/commit";
import { ScheduleJob } from "./internal/cron/cron";
import { CommitController } from "./internal/controller/commit";
import { CommitRepository } from "./internal/repository/commit";
import { AppSettings } from "./internal/redis/redis";
import { GithubCommit } from "./github/commit_service";
import { Redis } from "ioredis";

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
});

redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

const app: Express = express();

app.use(bodyParser.json());

app.use(Cors());

const JsonResponse = (res: Response, code: number, data: any) => {
  res.status(code).json(data);
};

interface setSettings {
  repo?: string;
  owner?: string;
  start_date?: string;
}

// run cron job

redisClient.on("ready", () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err: Error) => {
      console.error("Error connecting to DB:", err);
    });
});

const commitRepo = new CommitRepository();
const appSetting = new AppSettings(redisClient);
const commitClient = new GithubCommit(
  config.githubBaseUrl,
  config.githubOwner,
  config.githubRepo,
  config.githubToken,
  config.startDate,
  config.githubPageSize,
);
const commitCtrl = new CommitController(appSetting, commitRepo, commitClient);

app.get("/", async (_: Request, res: Response) => {
  try {
    const commits = await commitCtrl.fetchAndSaveCommits();
    JsonResponse(res, 200, { commits });
  } catch (error) {
    JsonResponse(res, 500, { error });
  }
});

app.get("/count", async (_: Request, res: Response) => {
  try {
    const autCount = await commitCtrl.getAuthoursCommitCount();
    res.status(200).json({ autCount });
  } catch (error) {
    if (error instanceof Error) {
      let errorObj: ApiError = new ApiError(error.message);
      res.status(500).json(errorObj);
    }
  }
});

app.post(
  "/settings",
  async (req: Request<{}, {}, setSettings>, res: Response) => {
    const ok = await commitCtrl.setSetting(
      req.body.repo ?? config.githubRepo,
      req.body.start_date ?? config.startDate,
      req.body.owner ?? config.githubOwner,
    );

    if (ok) {
      JsonResponse(res, 200, { message: "settings set" });
      return;
    }
    JsonResponse(res, 500, { message: "setting failed" });
  },
);
// Start cron job with proper binding
ScheduleJob(() => commitCtrl.fetchAndSaveCommits(), "*/2 * * * *", true);

app.listen(config.port, () => {
  console.log(`Listening on port: ${config.port}`);
});
