"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettingsRouter = getSettingsRouter;
const express_1 = __importDefault(require("express"));
const settings_handler_1 = require("../handler/settings_handler");
const settings_validator_1 = require("../validator/settings_validator");
function getSettingsRouter() {
    const settingRouter = express_1.default.Router();
    settingRouter.post("/", (0, settings_validator_1.setSettingsValidator)(), settings_handler_1.setSettingsHandler);
    return settingRouter;
}
