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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_database_1 = require("./internal/repository/pg_database");
const config_1 = require("./internal/config/config");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app_error_1 = require("./internal/error/app_error");
const commit_1 = require("./internal/controller/commit");
const cron_1 = require("./internal/cron/cron");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const JsonResponse = (res, code, data) => {
    res.status(code).json(data);
};
const ctrl = new commit_1.CommitController(config_1.config.githubBaseUrl, config_1.config.githubOwner, config_1.config.githubRepo, config_1.config.githubToken, config_1.config.startDate, config_1.config.githubPageSize);
// run cron job
(0, cron_1.ScheduleJob)(ctrl.fetchAndSaveCommits, "*/10 * * * *", true);
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commits = yield ctrl.fetchAndSaveCommits();
        JsonResponse(res, 200, { commits });
    }
    catch (error) {
        JsonResponse(res, 500, { error });
    }
}));
app.get("/count", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const autCount = yield ctrl.getAuthoursCommitCount();
        res.status(200).json({ autCount });
    }
    catch (error) {
        if (error instanceof Error) {
            let errorObj = new app_error_1.ApiError(error.message);
            res.status(500).json(errorObj);
        }
    }
}));
// initialize database and app
pg_database_1.AppDataSource.initialize()
    .then(() => {
    console.log("connected to db");
    app.listen(config_1.config.port, () => {
        console.log(`listening on port: ${config_1.config.port}`);
    });
})
    .catch((err) => {
    console.log("error connecting to db", err.message, err);
});
