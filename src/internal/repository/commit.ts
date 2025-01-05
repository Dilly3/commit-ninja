import { AppDataSource } from "src/internal/db/database";
import { CommitInfo } from "src/internal/db/entities/commit_entity";
import { CommitSumm } from "../db/entities/commit_summ";

export class CommitRepository {
  public constructor(
    public commitReposit = AppDataSource.getRepository(CommitInfo),
  ) {}

  async saveCommit(commitInfo: CommitInfo): Promise<CommitInfo> {
    // Check for existing commit with the same ID
    const existingCommit = await this.commitReposit.findOne({
      where: { id: commitInfo.id },
    });
    if (existingCommit) {
      return existingCommit; // Return existing commit if found
    }
    // Save and return the new commit
    return await this.commitReposit.save(commitInfo);
  }

  async saveCommits(commitInfos: CommitInfo[]): Promise<CommitInfo[]> {
    const savedCommits: CommitInfo[] = [];

    for (const commitInfo of commitInfos) {
      // Check for existing commit with the same ID
      const existingCommit = await this.commitReposit.findOne({
        where: { id: commitInfo.id },
      });

      if (existingCommit) {
        savedCommits.push(existingCommit);
      } else {
        // Save and return the new commit
        const savedCommit = await this.commitReposit.save(commitInfo);
        savedCommits.push(savedCommit);
      }
    }

    return savedCommits;
  }

  async getCommits(limit?: number): Promise<CommitInfo[]> {
    const query = this.commitReposit
      .createQueryBuilder("commit")
      .orderBy("commit.timestamp", "DESC");

    if (limit) {
      query.take(limit);
    }

    return await query.getMany();
  }

  async getCommitsByAuthor(
    authorName: string,
    limit?: number,
  ): Promise<CommitInfo[]> {
    const query = this.commitReposit
      .createQueryBuilder("commit")
      .where("commit.author_name = :authorName", { authorName })
      .orderBy("commit.timestamp", "DESC");

    if (limit) {
      query.take(limit);
    }

    return await query.getMany();
  }

  async getCommitsByEmail(
    authorEmail: string,
    limit?: number,
  ): Promise<CommitInfo[]> {
    const query = this.commitReposit
      .createQueryBuilder("commit")
      .where("commit.author_email = :authorEmail", { authorEmail })
      .orderBy("commit.timestamp", "DESC");

    if (limit) {
      query.take(limit);
    }

    return await query.getMany();
  }

  async getCommitCountsByAuthor(
    startDate?: Date,
    endDate?: Date,
  ): Promise<Array<CommitSumm>> {
    const query = this.commitReposit
      .createQueryBuilder("commit")
      .select("commit.author_email", "author_email")
      .addSelect("commit.author_name", "author_name")
      .addSelect("COUNT(*)", "commit_count");

    if (startDate) {
      query.andWhere("commit.timestamp >= :startDate", { startDate });
    }
    if (endDate) {
      query.andWhere("commit.timestamp <= :endDate", { endDate });
    }

    return await query
      .groupBy("commit.author_email")
      .orderBy("commit_count", "DESC")
      .getRawMany();
  }

  async getDateOfLastCommit(): Promise<string | null> {
    const mostRecentCommit = await this.commitReposit
      .createQueryBuilder("commit")
      .select("commit.date")
      .orderBy("commit.date", "DESC")
      .limit(1)
      .getOne();

    return mostRecentCommit ? mostRecentCommit.date : null;
  }
}
