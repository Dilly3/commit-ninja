import { appDataSource } from "./pg_database";
import { CommitInfo } from "../db/entities/commit_entity";
import { CommitSumm } from "../db/entities/commit_summ";
import { BuildPaginator, Order } from "../paginator/paginator";
import chalk from "chalk";

export class CommitRepository {
  public constructor(
    public commitReposit = appDataSource.getRepository(CommitInfo),
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

  async getCommits(limit?: number) {
    const query = this.commitReposit
      .createQueryBuilder("commitinfo")
      .orderBy("commitinfo.date", "DESC");

    if (limit) {
      query.take(limit);
    }

    const paginator = BuildPaginator(CommitInfo, Order.DESC, limit ?? 10);

    const { data, cursor: newCursor } = await paginator.paginate(query);
    const page = {
      data,
      cursor: newCursor,
    };
    return page;
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
    startDate?: string,
    endDate?: string,
  ): Promise<Array<CommitSumm>> {
    const query = this.commitReposit
      .createQueryBuilder("commit")
      .select("commit.author_email", "author_email")
      .addSelect("commit.author_name", "author_name")
      .addSelect("COUNT(*)", "commit_count");

    if (startDate) {
      const sd = new Date(startDate).toISOString();
      query.andWhere("commit.date >= :startDate", { sd });
    }
    if (endDate) {
      const ed = new Date(endDate).toISOString();
      query.andWhere("commit.date <= :endDate", { ed });
    }

    return await query
      .groupBy("commit.author_email")
      .addGroupBy("commit.author_name")
      .orderBy("commit_count", "DESC")
      .getRawMany();
  }

  async getDateOfLastCommit(repoName?: string): Promise<string | null> {
    try {
      const query = this.commitReposit
        .createQueryBuilder("commit")
        .select("commit.date")
        .orderBy("commit.date", "DESC")
        .limit(1);

      // Add repo name filter if provided
      if (repoName) {
        query.where("commit.repo_name = :repoName", { repoName });
      }

      const mostRecentCommit = await query.getOne();

      console.log(chalk.blue("Most recent commit found:", mostRecentCommit)); // Debug log

      if (!mostRecentCommit) {
        console.log(chalk.red("No commits found in database")); // Debug log
        return null;
      }

      if (!mostRecentCommit.date) {
        console.log(chalk.red("Most recent commit has no date")); // Debug log
        return null;
      }

      return mostRecentCommit.date;
    } catch (error) {
      console.error("Error fetching last commit date:", error); // Error log
      throw error;
    }
  }
}
