import { body, ValidationChain } from "express-validator";
import { CronInterval } from "../../../internal/cron/cron";

export function setSettingsValidator(): ValidationChain[] {
  const validatorchain = [
    body("repo")
      .isString()
      .withMessage("repo must be a string")
      .trim()
      .custom((value) => {
        if (value.includes(" ")) {
          throw new Error("repo cannot contain spaces");
        }
        return true;
      }),
    body("start_date")
      .isString()
      .withMessage("start_date must be a string")
      .trim()
      .custom((value) => {
        if (value.includes(" ")) {
          throw new Error("start_date cannot contain spaces");
        }
        return true;
      })
      .isISO8601()
      .withMessage("start_date must be a valid date in YYYY-MM-DD format"),
    body("cron_delay")
      .isString()
      .withMessage("cron_delay must be a string")
      .trim()
      .custom((value) => {
        if (value.includes(" ")) {
          throw new Error("cron_delay cannot contain spaces");
        }
        return true;
      })
      .isIn(Object.values(CronInterval))
      .withMessage(`delay value must be ${Object.values(CronInterval)}`),
  ];

  return validatorchain;
}
