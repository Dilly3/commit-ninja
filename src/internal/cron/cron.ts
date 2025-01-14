import { getConfigInstance } from "../config/config";

const nodeCron = require("node-cron");

type cronFunction = () => {};
export enum cronDelay {
  TWO_MINUTES = "*/2 * * * *",
  FIVE_MINUTES = "*/5 * * * *",
  TEN_MINUTES = "*/10 * * * *",
  HOURLY = "0 * * * *",
  DAILY = "0 0 * * *",
}

export function getEnumDelay(delay: string) {
  switch (delay) {
    case "2m":
      return cronDelay.TWO_MINUTES;
    case "5m":
      return cronDelay.FIVE_MINUTES;
    case "10m":
      return cronDelay.TEN_MINUTES;
    case "1h":
      return cronDelay.HOURLY;
    case "24h":
      return cronDelay.DAILY;
    default:
      return cronDelay.HOURLY;
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
