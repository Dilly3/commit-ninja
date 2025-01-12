import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import Cors from "cors";
import { ApiError } from "../error/app_error";
import { config } from "../config/config";
import { ctrl as commitCtrl } from "../controller/commit";
import { jsonResponse } from "./response";

export const app: Express = express();

app.use(bodyParser.json());

app.use(Cors());

interface setSettings {
  repo?: string;
  owner?: string;
  start_date?: string;
}

app.post(
  "/settings",
  async (req: Request<{}, {}, setSettings>, res: Response) => {
    const ok = await commitCtrl.setSetting(
      req.body.repo ?? config.githubRepo,
      req.body.start_date ?? config.startDate,
      req.body.owner ?? config.githubOwner,
    );

    if (ok) {
      jsonResponse(res, 200, { message: "settings set" });
      return;
    }
    jsonResponse(res, 500, { message: "setting failed" });
  },
);

app.get("/count", async (_: Request, res: Response) => {
  try {
    const autCount = await commitCtrl.getAuthoursCommitCount();
    jsonResponse(res, 200, { autCount });
  } catch (error) {
    if (error instanceof Error) {
      let errorObj: ApiError = new ApiError(error.message);
      jsonResponse(res, 500, errorObj);
    }
  }
});
