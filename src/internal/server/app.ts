import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getSettingsRouter } from "./router/settings_router";
import { getCommitRouter } from "./router/commits_router";
import { loggerMiddleware } from "./logger/logger";

export function initExpressApp(): Express {
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
  app.use("/settings", getSettingsRouter());
  app.use("/commits", getCommitRouter());

  return app;
}
