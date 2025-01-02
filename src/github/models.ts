
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

export interface CommitResponse { 
    sha : string
    commit: CommitDetails;
   author : author
   committer : committer
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