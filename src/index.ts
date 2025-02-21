import { initDataSource } from "./internal/repository/pg_database";
import { convertIntervalToSchedule, ScheduleJob } from "./cron/cron";
import { initCommitController } from "./internal/controller/commit";
import { getRedisInstance } from "./internal/redis/redis";
import { initExpressApp } from "./internal/server/router/app";
import { initConfig } from "./internal/config/config";
import { initRepoController } from "./internal/controller/repo";
import { initCommitRepository } from "./internal/repository/commit";
import { initRepoRepository } from "./internal/repository/repo";

const config = initConfig(".env");
initDataSource(config);

const redisClient = getRedisInstance();

const commitDB = initCommitRepository();
const repoDB = initRepoRepository();
const commitCtrl = initCommitController(redisClient, config, commitDB);
const repoCtrl = initRepoController(redisClient, config, repoDB);

const app = initExpressApp(commitDB, repoDB, commitCtrl, config);

// Start cron job with proper binding to fetch and save commits and repo
commitCtrl.appSetting.getAppSettings(config).then((setting) => {
  ScheduleJob(
    [() => commitCtrl.fetchAndSaveCommits(), () => repoCtrl.fetchAndSaveRepo()],
    convertIntervalToSchedule(config.nodeEnv, setting.CronDelay),
    true,
  );
});

app.listen(config.port, () => {
  console.log(`Listening on port: ${config.port}`);
});
