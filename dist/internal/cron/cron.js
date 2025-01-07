"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleJob = void 0;
const config_1 = require("../config/config");
const nodeCron = require("node-cron");
/**
 * Schedules a cron job to run at specified intervals
 * @param cronJob - The function to be executed on schedule
 * @param scheduler - Cron expression defining the schedule (e.g., "0 * * * *" for hourly)
 * @param scheduled - Boolean flag to enable/disable the scheduled execution
 * @returns void
 */
const ScheduleJob = (cronJob, scheduler, scheduled) => {
    try {
        nodeCron.schedule(scheduler, () => {
            const now = new Date();
            console.log(`Running scheduled cron at : ${now.toISOString()}...`);
            cronJob();
        }, {
            scheduled: scheduled,
            timezone: config_1.config.TZ,
        });
    }
    catch (error) {
        console.error("Error scheduling cron job:", error);
    }
};
exports.ScheduleJob = ScheduleJob;
