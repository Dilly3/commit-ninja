"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitRouter = getCommitRouter;
const express_1 = __importDefault(require("express"));
const commits_handler_1 = require("../handler/commits_handler");
function getCommitRouter() {
    const commitRouter = express_1.default.Router();
    commitRouter.get("/count", commits_handler_1.commitCountHandler);
    return commitRouter;
}
