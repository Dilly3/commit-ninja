"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleJob = exports.CronInterval = exports.CronSchedule = void 0;
exports.convertIntervalToSchedule = convertIntervalToSchedule;
const config_1 = require("../config/config");
const nodeCron = require("node-cron");
var CronSchedule;
(function (CronSchedule) {
    CronSchedule["TWO_MINUTES"] = "*/2 * * * *";
    CronSchedule["FIVE_MINUTES"] = "*/5 * * * *";
    CronSchedule["TEN_MINUTES"] = "*/10 * * * *";
    CronSchedule["HOURLY"] = "0 * * * *";
    CronSchedule["DAILY"] = "0 0 * * *";
})(CronSchedule || (exports.CronSchedule = CronSchedule = {}));
var CronInterval;
(function (CronInterval) {
    CronInterval["TWO_MINUTES"] = "2m";
    CronInterval["FIVE_MINUTES"] = "5m";
    CronInterval["TEN_MINUTES"] = "10m";
    CronInterval["HOURLY"] = "1h";
    CronInterval["DAILY"] = "24h";
})(CronInterval || (exports.CronInterval = CronInterval = {}));
function convertIntervalToSchedule(interval) {
    switch (interval) {
        case CronInterval.TWO_MINUTES:
            return CronSchedule.TWO_MINUTES;
        case CronInterval.FIVE_MINUTES:
            return CronSchedule.FIVE_MINUTES;
        case CronInterval.TEN_MINUTES:
            return CronSchedule.TEN_MINUTES;
        case CronInterval.HOURLY:
            return CronSchedule.HOURLY;
        case CronInterval.DAILY:
            return CronSchedule.DAILY;
        default:
            return CronSchedule.HOURLY;
    }
}
/**
 * Schedules a cron job to run at specified intervals
 * @param cronJob - The function to be executed on schedule
 * @param scheduler - Cron expression defining the schedule (e.g., "0 * * * *" for hourly)
 * @param scheduled - Boolean flag to enable/disable the scheduled execution
 * @returns void
 */
const ScheduleJob = (cronJob, scheduler, scheduled) => {
    const config = (0, config_1.getConfigInstance)();
    try {
        nodeCron.schedule(scheduler, () => {
            const now = new Date();
            console.log(`Running scheduled cron at : ${now.toISOString()}...`);
            cronJob();
        }, {
            scheduled: scheduled,
            timezone: config.TZ,
        });
    }
    catch (error) {
        console.error("Error scheduling cron job:", error);
    }
};
exports.ScheduleJob = ScheduleJob;
