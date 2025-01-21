"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettingsValidator = setSettingsValidator;
const express_validator_1 = require("express-validator");
const cron_1 = require("../../../cron/cron");
function setSettingsValidator() {
    const validatorchain = [
        (0, express_validator_1.body)("repo")
            .isString()
            .withMessage("repo must be a string")
            .trim()
            .custom((value) => {
            if (value.includes(" ")) {
                throw new Error("repo cannot contain spaces");
            }
            return true;
        }),
        (0, express_validator_1.body)("start_date")
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
        (0, express_validator_1.body)("cron_delay")
            .isString()
            .withMessage("cron_delay must be a string")
            .trim()
            .custom((value) => {
            if (value.includes(" ")) {
                throw new Error("cron_delay cannot contain spaces");
            }
            return true;
        })
            .isIn(Object.values(cron_1.CronInterval))
            .withMessage(`delay value must be ${Object.values(cron_1.CronInterval)}`),
    ];
    return validatorchain;
}
