import express from "express";
import {
  getRepoByLanguageHandler,
  getRepoWithMostStarsHandler,
} from "../handler/repo_handler";
import { IRepoRepository } from "../../repository/repo";

export function getRepoRouter(db: IRepoRepository) {
  const repoRouter = express.Router();

  repoRouter.get("/language/:language", getRepoByLanguageHandler(db));
  repoRouter.get("/stars/:limit", getRepoWithMostStarsHandler(db));
  return repoRouter;
}
