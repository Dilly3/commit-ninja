import { validationResult } from "express-validator";
import { getConfigInstance } from "../../config/config";
import { getCommitControllerInstance } from "../../controller/commit";
import { jsonResponse } from "../response";
import { Request, Response } from "express";

interface setSettings {
  repo?: string;
  owner?: string;
  start_date?: string;
  cron_delay: string;
}
export async function setSettingsHandler(
  req: Request<{}, {}, setSettings>,
  res: Response,
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    jsonResponse(res, 400, {
      message: "Validation failed",
      errors: errors.array(),
    });
    return;
  }
  const commitCtrl = getCommitControllerInstance();
  const config = getConfigInstance();
  const ok = await commitCtrl.setSetting(
    req.body.repo ?? config.githubRepo,
    req.body.start_date ?? config.startDate,
    req.body.cron_delay ?? config.cronDelay,
    req.body.owner ?? config.githubOwner,
  );

  if (ok) {
    jsonResponse(res, 200, { message: "settings set" });
    return;
  }
  jsonResponse(res, 500, { message: "setting failed" });
}
