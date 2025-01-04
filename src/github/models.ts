import { Expose, Transform } from 'class-transformer';
interface CommitDetails {
    id : string
    author: {
        name: string;
        email: string;
        date: string;
        id: string
        url: string
    };
   
    message: string;
    url: string;
}

interface author {
    id : string 
    url : string
}
interface committer {
    login : string,
    id : string,
    url : string
}

export class CommitResponse { 
    sha : string
    commit: CommitDetails;
   author : author
   committer : committer
}


export class RepoResponse {
    id: number;
    name: string;
    @Expose({name:'created_at'})
    @Transform(({ value }) => {
        const date = new Date(value)
        return date.toISOString()
    })
    createdAt: string;
    @Expose({name: 'updated_at'})
    @Transform(({ value }) => {
        const date = new Date(value)
    return date.toISOString()
    })
    updatedAt: string;
    url: string;
    description: string;
    language?: string;
    forks: number;
    stars?: number;
    openIssues?: number;
    size? : number
}

export interface RepoInfo {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    description: string;
    language: string;
    forks: number;
    stars: number;
    openIssues: number;
}


export interface CommitInfo {
    id  :       string 
    repoName :   string 
    message  :   string 
    authorName :  string
    authorEmail : string
    date   :     string
    url  :       string
}