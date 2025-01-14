"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettingsHandler = setSettingsHandler;
const express_validator_1 = require("express-validator");
const config_1 = require("../../config/config");
const commit_1 = require("../../controller/commit");
const response_1 = require("../response");
function setSettingsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            (0, response_1.jsonResponse)(res, 400, {
                message: "Validation failed",
                errors: errors.array(),
            });
            return;
        }
        const commitCtrl = (0, commit_1.getCommitControllerInstance)();
        const config = (0, config_1.getConfigInstance)();
        const ok = yield commitCtrl.setSetting((_a = req.body.repo) !== null && _a !== void 0 ? _a : config.githubRepo, (_b = req.body.start_date) !== null && _b !== void 0 ? _b : config.startDate, (_c = req.body.cron_delay) !== null && _c !== void 0 ? _c : config.cronDelay, (_d = req.body.owner) !== null && _d !== void 0 ? _d : config.githubOwner);
        if (ok) {
            (0, response_1.jsonResponse)(res, 200, { message: "settings set" });
            return;
        }
        (0, response_1.jsonResponse)(res, 500, { message: "setting failed" });
    });
}
