import express from "express";

import { setSettingsHandler } from "../handler/settings_handler";
import { setSettingsValidator } from "../validator/settings_validator";
import { CommitController } from "../../controller/commit";
import { Config } from "../../config/config";

export function getSettingsRouter(
  ctrl?: CommitController,
  config?: Config,
): express.Router {
  const settingRouter = express.Router();

  settingRouter.post(
    "/",
    setSettingsValidator(),
    setSettingsHandler(ctrl, config),
  );
  return settingRouter;
}
