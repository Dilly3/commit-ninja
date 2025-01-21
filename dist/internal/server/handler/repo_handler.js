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
exports.getRepoByLanguageHandler = getRepoByLanguageHandler;
exports.getRepoWithMostStarsHandler = getRepoWithMostStarsHandler;
const repo_dto_1 = require("../../dtos/repo_dto");
const repo_1 = require("../../controller/repo");
function getRepoByLanguageHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const language = req.params.language.toLowerCase().trim();
            const repoCtrl = (0, repo_1.getRepoControllerInstance)();
            const repo = yield repoCtrl.getRepoByLanguage(language);
            const dto = repo.map((r) => (0, repo_dto_1.convertToRepoDto)(r));
            res.status(200).json(dto);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function getRepoWithMostStarsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repoCtrl = (0, repo_1.getRepoControllerInstance)();
            const limit = req.params.limit ? parseInt(req.params.limit) : 1;
            const maxStars = yield repoCtrl.getReposWithMostStars(limit);
            res.status(200).json(maxStars);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
