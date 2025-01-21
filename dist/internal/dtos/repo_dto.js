"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToRepoDto = void 0;
const convertToRepoDto = (repo) => {
    return {
        id: repo.id,
        name: repo.name,
        url: repo.url,
        description: repo.description,
        language: repo.language,
        forks: repo.forks,
        stars: repo.stars,
        openIssues: repo.openIssues
    };
};
exports.convertToRepoDto = convertToRepoDto;
