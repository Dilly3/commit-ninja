import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./internal/repository/pg_database";
import { config } from "./internal/config/config";

import bodyParser from "body-parser";
import Cors from "cors";
import { ApiError } from "./internal/error/app_error";
import { CommitController } from "./internal/controller/commit";
import { ScheduleJob } from "./internal/cron/cron";

const app: Express = express();

app.use(bodyParser.json());

app.use(Cors());

const JsonResponse = (res: Response, code: number, data: any) => {
  res.status(code).json(data);
};

const ctrl = new CommitController(
  config.githubBaseUrl,
  config.githubOwner,
  config.githubRepo,
  config.githubToken,
  config.startDate,
  config.githubPageSize,
);

// run cron job
ScheduleJob(ctrl.fetchAndSaveCommits, "*/10 * * * *", true);

app.get("/", async (_: Request, res: Response) => {
  try {
    const commits = await ctrl.fetchAndSaveCommits();
    JsonResponse(res, 200, { commits });
  } catch (error) {
    JsonResponse(res, 500, { error });
  }
});

app.get("/count", async (_: Request, res: Response) => {
  try {
    const autCount = await ctrl.getAuthoursCommitCount();
    res.status(200).json({ autCount });
  } catch (error) {
    if (error instanceof Error) {
      let errorObj: ApiError = new ApiError(error.message);
      res.status(500).json(errorObj);
    }
  }
});

// initialize database and app
AppDataSource.initialize()
  .then(() => {
    console.log("connected to db");
    app.listen(config.port, () => {
      console.log(`listening on port: ${config.port}`);
    });
  })
  .catch((err: Error) => {
    console.log("error connecting to db", err.message, err);
  });
