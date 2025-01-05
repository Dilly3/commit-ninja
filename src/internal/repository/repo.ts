import { MaxStars, RepoInfo } from "./../db/entities/repo_entity";
import { AppDataSource } from "../db/database";

export class RepoRepository {
  constructor(public RepoReposit = AppDataSource.getRepository(RepoInfo)) {}

  async getRepoByName(name: string) {
    return await this.RepoReposit.findOne({
      where: {
        name: name,
      },
    });
  }
}
