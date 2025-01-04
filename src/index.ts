import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./db/database";
import { config } from "./config/config";

import bodyParser from "body-parser";
import Cors from "cors";
import { GithubCommit } from "./github/commit_service";

const app: Express = express();

app.use(bodyParser.json());

app.use(Cors());

app.get("/", async (req: Request, res: Response) => {
  const commitIns = new GithubCommit(
    config.githubBaseUrl,
    config.githubOwner,
    config.githubRepo,
    config.githubToken,
    config.startDate,
  );
  try {
    const commits = await commitIns.getCommits();
    const comms = commits.map((commit) => commitIns.getCommitInstance(commit));

    console.log(req.body);
    res.send(comms);
  } catch (error) {
    console.error("Error fetching commits:", error);
    res.status(500).send("Error fetching commits");
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
