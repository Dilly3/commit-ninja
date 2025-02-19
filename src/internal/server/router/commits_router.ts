import express from "express";

import { commitCountHandler } from "../handlers/commits_handler";
import { ICommitRepository } from "../../repository/commit";

export function getCommitRouter(db: ICommitRepository) {
  const commitRouter = express.Router();

  commitRouter.get("/count", commitCountHandler(db));
  return commitRouter;
}
