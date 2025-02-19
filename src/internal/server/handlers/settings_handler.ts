import { BadRequest, InternalServerError, OK } from "../response";
import { validationResult } from "express-validator";
import { Config, getConfigInstance } from "../../config/config";
import {
  CommitController,
  getCommitControllerInstance,
} from "../../controller/commit";
import { Request, Response } from "express";
import { getValidationError } from "../validator/settings_validator";

interface SetSettings {
  repo?: string;
  owner?: string;
  start_date?: string;
  cron_delay: string;
}

export function setSettingsHandler(
  ctrl?: CommitController,
  config?: Config,
): any {
  return async function setSettingsHandler(
    req: Request<{}, {}, SetSettings>,
    res: Response,
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errString = getValidationError(errors.array())[0].msg;
      BadRequest(res, errString);
      return;
    }
    config = config ?? getConfigInstance();
    ctrl = ctrl ?? getCommitControllerInstance();

    const ok = await ctrl.setSetting(
      req.body.repo ?? config.githubRepo,
      req.body.start_date ?? config.startDate,
      req.body.cron_delay ?? config.cronDelay,
      req.body.owner ?? config.githubOwner,
    );

    if (ok) {
      OK(res, null);
      return;
    }
    InternalServerError(res, "failed to set settings");
    return;
  };
}
