import { initDataSource } from "./internal/repository/pg_database";
import { convertIntervalToSchedule, ScheduleJob } from "./cron/cron";
import { initCommitController } from "./internal/controller/commit";
import { getRedisInstance } from "./internal/redis/redis";
import { initExpressApp } from "./internal/server/app";
import { initConfig } from "./internal/config/config";
import { getRepoControllerInstance } from "./internal/controller/repo";

const config = initConfig(".env");
const appDataSource = initDataSource(config);

const redisClient = getRedisInstance();

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
const repoCtrl = getRepoControllerInstance(redisClient, config);

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
