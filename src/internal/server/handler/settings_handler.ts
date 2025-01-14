import { getConfigInstance } from "../../config/config";
import { getCommitControllerInstance } from "../../controller/commit";
import { jsonResponse } from "../response";
import { Request, Response } from "express";

interface setSettings {
  repo?: string;
  owner?: string;
  start_date?: string;
}
export async function setSettingsHandler(
  req: Request<{}, {}, setSettings>,
  res: Response,
) {
  const commitCtrl = getCommitControllerInstance();
  const config = getConfigInstance();
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
}
