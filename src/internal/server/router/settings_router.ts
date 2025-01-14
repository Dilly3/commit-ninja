import express from "express";

import { setSettingsHandler } from "../handler/settings_handler";

export function getSettingsRouter() {
  const settingRouter = express.Router();

  settingRouter.post("/", setSettingsHandler);
  return settingRouter;
}
