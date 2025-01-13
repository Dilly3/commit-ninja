import express, { Request, Response } from "express";
import { config } from "../config/config";
import { commitCtrl } from "../controller/commit";
import { jsonResponse } from "./response";

interface setSettings {
  repo?: string;
  owner?: string;
  start_date?: string;
}

export const settingRouter = express.Router();
settingRouter.post(
  "/",
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
