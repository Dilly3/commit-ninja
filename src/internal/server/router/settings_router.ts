import express from "express";

import { setSettingsHandler } from "../handler/settings_handler";
import { setSettingsValidator } from "../validator/settings_validator";

export function getSettingsRouter() {
  const settingRouter = express.Router();

  settingRouter.post("/", setSettingsValidator(), setSettingsHandler);
  return settingRouter;
}
