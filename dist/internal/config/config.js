"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
var configDefaults;
(function (configDefaults) {
    configDefaults[configDefaults["DefaultPageSize"] = 10] = "DefaultPageSize";
    configDefaults["DefaultDBPORT"] = "5436";
    configDefaults["DefaultPostgresUser"] = "postgres";
    configDefaults["DefaultPostgresHost"] = "localhost";
    configDefaults["DefaultPostgresPassword"] = "postgres";
    configDefaults["DefaultAppPort"] = "7020";
    configDefaults["DefaultTimeZone"] = "Africa/Lagos";
})(configDefaults || (configDefaults = {}));
dotenv_1.default.config();
class Config {
    constructor(port, dbPort, dbHost, dbUser, dbPassword, dbName, githubBaseUrl, githubToken, githubOwner, githubRepo, githubPageSize, startDate, TZ) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (port === void 0) { port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : configDefaults.DefaultAppPort; }
        if (dbPort === void 0) { dbPort = parseInt((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : configDefaults.DefaultDBPORT); }
        if (dbHost === void 0) { dbHost = (_c = process.env.DB_HOST) !== null && _c !== void 0 ? _c : configDefaults.DefaultPostgresHost; }
        if (dbUser === void 0) { dbUser = (_d = process.env.DB_USER) !== null && _d !== void 0 ? _d : configDefaults.DefaultPostgresUser; }
        if (dbPassword === void 0) { dbPassword = (_e = process.env.DB_PASSWORD) !== null && _e !== void 0 ? _e : configDefaults.DefaultPostgresPassword; }
        if (dbName === void 0) { dbName = (_f = process.env.DB_NAME) !== null && _f !== void 0 ? _f : "commit_ninja"; }
        if (githubBaseUrl === void 0) { githubBaseUrl = (_g = process.env.GITHUB_BASE_URL) !== null && _g !== void 0 ? _g : ""; }
        if (githubToken === void 0) { githubToken = (_h = process.env.GITHUB_TOKEN) !== null && _h !== void 0 ? _h : ""; }
        if (githubOwner === void 0) { githubOwner = (_j = process.env.GITHUB_OWNER) !== null && _j !== void 0 ? _j : ""; }
        if (githubRepo === void 0) { githubRepo = (_k = process.env.GITHUB_REPO) !== null && _k !== void 0 ? _k : ""; }
        if (githubPageSize === void 0) { githubPageSize = process.env.PAGE_SIZE
            ? parseInt(process.env.PAGE_SIZE)
            : configDefaults.DefaultPageSize; }
        if (startDate === void 0) { startDate = (_l = process.env.GITHUB_START_DATE) !== null && _l !== void 0 ? _l : ""; }
        if (TZ === void 0) { TZ = (_m = process.env.TZ) !== null && _m !== void 0 ? _m : configDefaults.DefaultTimeZone; }
        this.port = port;
        this.dbPort = dbPort;
        this.dbHost = dbHost;
        this.dbUser = dbUser;
        this.dbPassword = dbPassword;
        this.dbName = dbName;
        this.githubBaseUrl = githubBaseUrl;
        this.githubToken = githubToken;
        this.githubOwner = githubOwner;
        this.githubRepo = githubRepo;
        this.githubPageSize = githubPageSize;
        this.startDate = startDate;
        this.TZ = TZ;
    }
}
exports.config = new Config();
