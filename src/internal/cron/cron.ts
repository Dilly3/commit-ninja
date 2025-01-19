import { getConfigInstance } from "../config/config";

const nodeCron = require("node-cron");

type CronFunction = () => {};

export enum CronSchedule {
  TWO_MINUTES = "*/2 * * * *",
  FIVE_MINUTES = "*/5 * * * *",
  TEN_MINUTES = "*/10 * * * *",
  HOURLY = "0 * * * *",
  DAILY = "0 0 * * *",
}

export enum CronInterval {
  TWO_MINUTES = "2m",
  FIVE_MINUTES = "5m",
  TEN_MINUTES = "10m",
  HOURLY = "1h",
  DAILY = "24h",
}

export function convertIntervalToSchedule(interval: string): CronSchedule {
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
