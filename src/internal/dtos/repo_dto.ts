import { RepoInfo } from "../db/entities/repo_entity";

export interface RepoDto {
    id: number;
    name: string;
    url: string;
    description: string | null;
    language : string;
    forks: number;
    stars: number;
    openIssues: number;
}

export const convertToRepoDto = (repo: RepoInfo): RepoDto => {
    return {
        id: repo.id,
        name: repo.name,
        url: repo.url,
        description: repo.description,
        language: repo.language,
        forks: repo.forks,
        stars: repo.stars,
        openIssues: repo.openIssues
}
}