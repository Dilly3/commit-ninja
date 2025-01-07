import { MaxStars, RepoInfo } from "./../db/entities/repo_entity";
import { AppDataSource } from "./pg_database";

export class RepoRepository {
  constructor(public RepoReposit = AppDataSource.getRepository(RepoInfo)) {}

  async getRepoByName(name: string) {
    return await this.RepoReposit.findOne({
      where: {
        name: name,
      },
    });
  }

  async getReposWithMostStars(limit: number = 1): Promise<Array<MaxStars>> {
    const query = this.RepoReposit.createQueryBuilder("repo")
      .select(["repo.name", "repo.url", "repo.stars"])
      .orderBy("repo.stars", "DESC");

    if (limit) {
      query.limit(limit);
    }

    const repos = await query.getMany();
    return repos.map((repo) => ({
      name: repo.name,
      url: repo.url,
      stars: repo.stars,
    }));
  }
}
