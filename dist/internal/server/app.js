"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initExpressApp = initExpressApp;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const settings_router_1 = require("./router/settings_router");
const commits_router_1 = require("./router/commits_router");
const logger_1 = require("./logger/logger");
function initExpressApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({
        extended: true,
    }));
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    // parse application/json
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)());
    app.use(logger_1.loggerMiddleware);
    app.use("/settings", (0, settings_router_1.getSettingsRouter)());
    app.use("/commits", (0, commits_router_1.getCommitRouter)());
    return app;
}
