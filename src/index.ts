console.log('hello world')
import dotenv from "dotenv"
import { GithubClient } from "./github/github_client";
import { CommitInfo } from "./github/models";

dotenv.config()

const ghClient = new GithubClient()
ghClient.getRepo("2024-01-01",5,2)
.then(commits => {commits.map(commit => {
    const commitInfo : CommitInfo = {
        id : commit.sha,
        repoName :  ghClient.repo, 
        message  :   commit.commit.message,
        authorName :  commit.committer.login,
        authorEmail : commit.commit.author.email,
        date   :    commit.commit.author.date,
        url  :       commit.commit.url.split('/git/')[0]
    }
    console.log(commitInfo)

})}).catch(error => console.error(error));
   