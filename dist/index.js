"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('hello world');
const dotenv_1 = __importDefault(require("dotenv"));
const github_client_1 = require("./github/github_client");
dotenv_1.default.config();
const ghClient = new github_client_1.GithubClient();
ghClient.getRepo("2024-01-01", 5, 2)
    .then(commits => {
    commits.map(commit => {
        const commitInfo = {
            id: commit.sha,
            repoName: ghClient.repo,
            message: commit.commit.message,
            authorName: commit.committer.login,
            authorEmail: commit.commit.author.email,
            date: commit.commit.author.date,
            url: commit.commit.url.split('/git/')[0]
        };
        console.log(commitInfo);
    });
}).catch(error => console.error(error));
