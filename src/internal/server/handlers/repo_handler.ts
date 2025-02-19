import { convertToRepoDto } from "../../dtos/repo_dto";
import { Request, Response } from "express";
import { ErrInternalServer, InternalServerError, OK } from "../response";
import { IRepoRepository } from "../../repository/repo";
import { RepoInfo } from "../../db/entities/repo_entity";

interface RepoParams {
  language: string;
  limit: string;
}

export function getRepoByLanguageHandler(db: IRepoRepository): any {
  return async function (req: Request<RepoParams>, res: Response) {
    try {
      const language = req.params.language.toLowerCase().trim();

      const repo = await db.getRepoByLanguage(language);

      const dto = repo.map((r: RepoInfo) => convertToRepoDto(r));
      OK(res, dto);
      return;
    } catch (error) {
      if (error instanceof Error) {
        InternalServerError(res, error.message);
        return;
      }
      InternalServerError(res, ErrInternalServer.message);
      return;
    }
  };
}

export function getRepoWithMostStarsHandler(db: IRepoRepository): any {
  return async function (req: Request<RepoParams>, res: Response) {
    try {
      const limit = req.params.limit ? parseInt(req.params.limit) : 1;
      const maxStars = await db.getReposWithMostStars(limit);
      OK(res, maxStars);
    } catch (error) {
      if (error instanceof Error) {
        InternalServerError(res, error.message);
        return;
      }
      InternalServerError(res, ErrInternalServer.message);
      return;
    }
  };
}
