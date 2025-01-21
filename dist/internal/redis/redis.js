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
exports.AppSettings = void 0;
exports.getRedisInstance = getRedisInstance;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config/config");
const app_error_1 = require("../error/app_error");
let defaultRedisClient = null;
class AppSettings {
    constructor(redisInstance) {
        this.redisInstance = redisInstance;
    }
    initAppSettings(repo, startDate, cronDelay, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const isoDate = new Date(startDate).toISOString();
            // Build array of Redis operations
            const operations = [
                this.redisInstance.set("repo", repo),
                this.redisInstance.set("startDate", isoDate),
            ];
            if (cronDelay)
                operations.push(this.redisInstance.set("cronDelay", cronDelay));
            if (owner)
                operations.push(this.redisInstance.set("owner", owner));
            try {
                yield Promise.all(operations);
                return true;
            }
            catch (error) {
                throw new app_error_1.ApiError("Failed to initialize app settings");
            }
        });
    }
    loadappSettings(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [owner, repo, startDate, cronDelay] = yield Promise.all([
                    this.redisInstance.get("owner"),
                    this.redisInstance.get("repo"),
                    this.redisInstance.get("startDate"),
                    this.redisInstance.get("cronDelay"),
                ]);
                return {
                    Owner: owner !== null && owner !== void 0 ? owner : config.githubOwner,
                    Repo: repo !== null && repo !== void 0 ? repo : config.githubRepo,
                    StartDate: startDate !== null && startDate !== void 0 ? startDate : config.startDate,
                    CronDelay: cronDelay !== null && cronDelay !== void 0 ? cronDelay : config.cronDelay,
                };
            }
            catch (err) {
                throw err instanceof Error ? err : new Error("Unknown Redis error");
            }
        });
    }
    getAppSettings(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.loadappSettings(config);
        });
    }
}
exports.AppSettings = AppSettings;
function initRedis() {
    const config = (0, config_1.getConfigInstance)();
    const redisClient = new ioredis_1.default({
        host: config.redisHost,
        port: config.redisPort,
        // Add retry strategy
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });
    // 2. Handle Redis events properly
    redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err);
        throw err;
    });
    redisClient.on("connect", () => {
        console.log("Redis Client Connected");
        defaultRedisClient = redisClient;
    });
    return redisClient;
}
function getRedisInstance() {
    if (!defaultRedisClient) {
        defaultRedisClient = initRedis();
    }
    return defaultRedisClient;
}
