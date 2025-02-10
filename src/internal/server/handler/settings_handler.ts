import { validationResult } from "express-validator";
import { getConfigInstance } from "../../config/config";
import { getCommitControllerInstance } from "../../controller/commit";
import { jsonResponse, New } from "../response";
import { Request, Response } from "express";
import { ApiError } from "../../error/app_error";

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
    jsonResponse(
      res,
      New(
        "validation failed",
        new ApiError(errors.array().join("\n")),
        400,
        null,
      ),
    );
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
    jsonResponse(res, New("settings set", null, 200, null));
    return;
  }
  jsonResponse(
    res,
    New("setting failed", new ApiError("failed to set setting"), 500, null),
  );
}
