"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_database_1 = require("./internal/repository/pg_database");
const cron_1 = require("./internal/cron/cron");
const commit_1 = require("./internal/controller/commit");
const redis_1 = require("./internal/redis/redis");
const app_1 = require("./internal/server/app");
const config_1 = require("./internal/config/config");
const repo_1 = require("./internal/controller/repo");
const config = (0, config_1.initConfig)();
const appDataSource = (0, pg_database_1.initDataSource)(config);
const redisClient = (0, redis_1.initRedis)();
redisClient.on("ready", () => {
    appDataSource
        .initialize()
        .then(() => {
        console.log("Connected to DB");
    })
        .catch((err) => {
        console.error("Error connecting to DB:", err);
    });
});
const commitCtrl = (0, commit_1.initCommitController)(redisClient, config);
const repoCtrl = (0, repo_1.initRepoController)(redisClient, config);
const app = (0, app_1.initExpressApp)();
// Start cron job with proper binding
commitCtrl.appSetting.getAppSettings(config).then((setting) => {
    (0, cron_1.ScheduleJob)([() => commitCtrl.fetchAndSaveCommits(), () => repoCtrl.fetchAndSaveRepo()], (0, cron_1.convertIntervalToSchedule)(setting.CronDelay), true);
});
app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`);
});
