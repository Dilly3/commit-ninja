import { initDataSource } from "./internal/repository/pg_database";
import { convertIntervalToSchedule, ScheduleJob } from "./internal/cron/cron";
import { initCommitController } from "./internal/controller/commit";
import { initRedis } from "./internal/redis/redis";
import { initExpressApp } from "./internal/server/app";
import { initConfig } from "./internal/config/config";
import { initRepoController } from "./internal/controller/repo";

const config = initConfig();
const appDataSource = initDataSource(config);

const redisClient = initRedis();

redisClient.on("ready", () => {
  appDataSource
    .initialize()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err: Error) => {
      console.error("Error connecting to DB:", err);
    });
});

const commitCtrl = initCommitController(redisClient, config);
const repoCtrl = initRepoController(redisClient, config);

const app = initExpressApp();

// Start cron job with proper binding
commitCtrl.appSetting.getAppSettings(config).then((setting) => {
  ScheduleJob(
    [() => commitCtrl.fetchAndSaveCommits(), () => repoCtrl.fetchAndSaveRepo()],
    convertIntervalToSchedule(setting.CronDelay),
    true,
  );
});

app.listen(config.port, () => {
  console.log(`Listening on port: ${config.port}`);
});
