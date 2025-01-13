import {
  appDataSource,
  setupDataSource,
} from "./internal/repository/pg_database";
import { initConfig } from "./internal/config/config";
import { initCommitController } from "./internal/controller/commit";
import { app } from "./internal/server/app";
import { ScheduleJob } from "./internal/cron/cron";
import { initializeRedisClient } from "./internal/redis/redis";

const config = initConfig();
setupDataSource(config);
const commitCtrl = initCommitController(config);
console.log("commitCtrl after initialization:", commitCtrl.commitClient);

// run cron job

// initialize database and app
appDataSource
  .initialize()
  .then(async () => {
    console.log("connected to db");
    await initializeRedisClient(config);
    ScheduleJob(commitCtrl.fetchAndSaveCommits, "*/2 * * * *", true);
    app.listen(config.port, () => {
      console.log(`listening on port: ${config.port}`);
    });
  })
  .catch((err: Error) => {
    console.log("error connecting to db", err.message, err);
  });
