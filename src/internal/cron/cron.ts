import { getConfigInstance } from "../config/config";

const nodeCron = require("node-cron");

type cronFunction = () => {};

/**
 * Schedules a cron job to run at specified intervals
 * @param cronJob - The function to be executed on schedule
 * @param scheduler - Cron expression defining the schedule (e.g., "0 * * * *" for hourly)
 * @param scheduled - Boolean flag to enable/disable the scheduled execution
 * @returns void
 */
export const ScheduleJob = (
  cronJob: cronFunction,
  scheduler: string,
  scheduled: boolean,
) => {
  const config = getConfigInstance();
  try {
    nodeCron.schedule(
      scheduler,
      () => {
        const now = new Date();
        console.log(`Running scheduled cron at : ${now.toISOString()}...`);
        cronJob();
      },
      {
        scheduled: scheduled,
        timezone: config.TZ,
      },
    );
  } catch (error) {
    console.error("Error scheduling cron job:", error);
  }
};
