import express from "express";
import {
  getRepoByLanguageHandler,
  getRepoWithMostStarsHandler,
} from "../handler/repo_handler";

export function getRepoRouter() {
  const repoRouter = express.Router();

  repoRouter.get("/language/:language", getRepoByLanguageHandler);
  repoRouter.get("/stars/:limit", getRepoWithMostStarsHandler);
  return repoRouter;
}
