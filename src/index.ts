import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./internal/db/database";
import { config } from "./internal/config/config";

import bodyParser from "body-parser";
import Cors from "cors";
import { GithubCommit } from "./github/commit_service";
import { CommitInfo } from "./internal/db/entities/commit_entity";
import { ApiError } from "./internal/error/app_error";
import { CommitController } from "./internal/controller/commit";

const app: Express = express();

app.use(bodyParser.json());

app.use(Cors());

app.get("/", async (req: Request, res: Response) => {
  const construc = new CommitController();
  const commitIns = new GithubCommit(
    config.githubBaseUrl,
    config.githubOwner,
    config.githubRepo,
    config.githubToken,
    config.startDate,
    config.githubPageSize,
  );
  try {
    let page = 1;
    let allCommits: CommitInfo[] = [];

    while (true) {
      const commits = await commitIns.getCommits(page);
      if (!commits || commits.length === 0) {
        break;
      }
      const comms = commits.map((commit) =>
        commitIns.getCommitInstance(commit),
      );
      allCommits = [...allCommits, ...comms];
      page++;
    }

    console.log(req.body);
    const dbResults = await construc.saveCommits(allCommits);
    const commitsfromdb = await construc.getCommits();

    res.status(200).json({
      count: dbResults.length,
      commits: commitsfromdb,
    });
  } catch (error) {
    console.error("Error fetching commits:", error);
    res.status(500).send("Error fetching commits");
  }
});

app.get("/count", async (_: Request, res: Response) => {
  const construc = new CommitController();
  try {
    const autCount = await construc.getAuthoursCommitCount();
    res.status(200).json({ autCount });
  } catch (error) {
    if (error instanceof Error) {
      let errorObj: ApiError = new ApiError(error.message);
      res.status(500).json(errorObj);
    }
  }
});

// initialize database and app
AppDataSource.initialize()
  .then(() => {
    console.log("connected to db");
    app.listen(config.port, () => {
      console.log(`listening on port: ${config.port}`);
    });
  })
  .catch((err: Error) => {
    console.log("error connecting to db", err.message, err);
  });
