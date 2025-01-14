import express from "express";

import { commitCountHandler } from "../handler/commits_handler";

export function getCommitRouter() {
  const commitRouter = express.Router();

  commitRouter.get("/count", commitCountHandler);
  return commitRouter;
}
