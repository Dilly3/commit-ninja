"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoRouter = getRepoRouter;
const express_1 = __importDefault(require("express"));
const repo_handler_1 = require("../handler/repo_handler");
function getRepoRouter() {
    const repoRouter = express_1.default.Router();
    repoRouter.get("/language/:language", repo_handler_1.getRepoByLanguageHandler);
    repoRouter.get("/stars/:limit", repo_handler_1.getRepoWithMostStarsHandler);
    return repoRouter;
}
