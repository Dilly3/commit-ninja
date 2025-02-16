import { validationResult } from "express-validator";
import { Config, getConfigInstance } from "../../config/config";
import {
  CommitController,
  getCommitControllerInstance,
} from "../../controller/commit";
import {
  httpBadRequest,
  httpInternalServerError,
  httpOK,
  jsonResponse,
  New,
} from "../response";
import { Request, Response } from "express";
import { ApiError } from "../../error/app_error";

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
      jsonResponse(
        res,
        New(
          "validation failed",
          new ApiError(errors.array().join("\n")),
          httpBadRequest,
          null,
        ),
      );
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
      jsonResponse(res, New("settings set", null, httpOK, null));
      return;
    }

    jsonResponse(
      res,
      New(
        "setting failed",
        new ApiError("failed to set setting"),
        httpInternalServerError,
        null,
      ),
    );
  };
}
