import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getSettingsRouter } from "./router/settings_router";
import { getCommitRouter } from "./router/commits_router";
import { loggerMiddleware } from "./logger/logger";
import { getRepoRouter } from "./router/repo_router";
import { Request, Response } from "express";
import { ICommitRepository } from "../repository/commit";
import { IRepoRepository } from "../repository/repo";
import { Config } from "../config/config";
import { CommitController } from "../controller/commit";

export function initExpressApp(
  commitDB: ICommitRepository,
  repoDB: IRepoRepository,
  commitCtrl?: CommitController,
  config?: Config,
): Express {
  const app: Express = express();

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.use(cors());
  app.use(loggerMiddleware);
  app.use("/settings", getSettingsRouter(commitCtrl, config));
  app.use("/commits", getCommitRouter(commitDB));
  app.use("/repos", getRepoRouter(repoDB));
  app.get("/ping", async (_: Request, res: Response) => {
    res.status(200).json("pong!!");
  });

  return app;
}
