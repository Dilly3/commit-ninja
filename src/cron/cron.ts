import { getConfigInstance } from "../internal/config/config";

const nodeCron = require("node-cron");

type CronFunction = () => {};

export enum CronSchedule {
  FIVE_MINUTES = "*/5 * * * *",
  HOURLY = "0 * * * *",
  DAILY = "0 0 * * *",
}

export enum CronInterval {
  FIVE_MINUTES = "5m",
  HOURLY = "1h",
  DAILY = "24h",
}

export function convertIntervalToSchedule(
  environment: string,
  interval: string,
): CronSchedule {
  if (environment === "production") {
    switch (interval) {
      case CronInterval.FIVE_MINUTES:
        return CronSchedule.FIVE_MINUTES;
      case CronInterval.HOURLY:
        return CronSchedule.HOURLY;
      case CronInterval.DAILY:
        return CronSchedule.DAILY;
      default:
        return CronSchedule.HOURLY;
    }
  }

  return CronSchedule.FIVE_MINUTES;
}

/**
 * Schedules a cron job to run at specified intervals
 * @param cronJob - The function to be executed on schedule
 * @param scheduler - Cron expression defining the schedule (e.g., "0 * * * *" for hourly)
 * @param scheduled - Boolean flag to enable/disable the scheduled execution
 * @returns void
 */
export const ScheduleJob = (
  cronJobs: CronFunction[],
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
        cronJobs.forEach((job) => job());
      },
      {
        scheduled: scheduled,
        timezone: config.TZ,
      },
    );
  } catch (error) {
    console.error("Error scheduling cron job(s):", error);
  }
};
