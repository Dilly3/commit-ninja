import { convertToRepoDto } from "../../dtos/repo_dto";
import { Request, Response } from "express";
import {
  ErrInternalServer,
  httpInternalServerError,
  httpOK,
  jsonResponse,
  New,
} from "../response";
import { ApiError } from "../../error/app_error";
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
      jsonResponse(res, New("successful", null, httpOK, dto));
      return;
    } catch (error) {
      if (error instanceof Error) {
        jsonResponse(
          res,
          New(
            "failed to get repo",
            new ApiError(error.message),
            httpInternalServerError,
            null,
          ),
        );
        return;
      }
      jsonResponse(
        res,
        New(
          "failed to get repo",
          ErrInternalServer,
          httpInternalServerError,
          null,
        ),
      );
    }
  };
}

export function getRepoWithMostStarsHandler(db: IRepoRepository): any {
  return async function (req: Request<RepoParams>, res: Response) {
    try {
      const limit = req.params.limit ? parseInt(req.params.limit) : 1;
      const maxStars = await db.getReposWithMostStars(limit);
      jsonResponse(res, New("successful", null, 200, maxStars));
    } catch (error) {
      if (error instanceof Error) {
        jsonResponse(
          res,
          New(
            "failed to get repo",
            new ApiError(error.message),
            httpInternalServerError,
            null,
          ),
        );
        return;
      }
      jsonResponse(
        res,
        New(
          "failed to get repo",
          ErrInternalServer,
          httpInternalServerError,
          null,
        ),
      );
    }
  };
}
