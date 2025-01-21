import { plainToInstance } from "class-transformer";
import { MaxStars, RepoInfo } from "./../db/entities/repo_entity";
import { getAppDataSourceInstance } from "./pg_database";

export class RepoRepository {
  constructor(
    public RepoReposit = getAppDataSourceInstance().getRepository(RepoInfo),
  ) {}

  async saveRepo(repoInfo: RepoInfo): Promise<RepoInfo> {
    const existingRepo = await this.RepoReposit.findOne({
      where: { name: repoInfo.name, id: repoInfo.id },
    });

    if (existingRepo) {
      // Update existing repo with new information
      Object.assign(existingRepo, repoInfo);
      return await this.RepoReposit.save(
        plainToInstance(RepoInfo, existingRepo),
      );
    }
    return await this.RepoReposit.save(plainToInstance(RepoInfo, repoInfo));
  }

  async getRepoByName(name: string) {
    return await this.RepoReposit.findOne({
      where: {
        name: name,
      },
    });
  }

  async getRepoByLanguage(language: string) {
    const query = this.RepoReposit.createQueryBuilder("repo")
      .where("repo.language = :language", { language: language })
      .getMany();
    return await query;
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
