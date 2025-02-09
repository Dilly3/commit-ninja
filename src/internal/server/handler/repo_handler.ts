import { convertToRepoDto } from "../../dtos/repo_dto";
import { getRepoControllerInstance } from "../../controller/repo";
import { Request, Response } from "express";
import { jsonResponse, New } from "../response";
import { ApiError } from "../../error/app_error";

interface RepoParams {
  language: string;
  limit: string;
}

export async function getRepoByLanguageHandler(
  req: Request<RepoParams>,
  res: Response,
) {
  try {
    const language = req.params.language.toLowerCase().trim();
    const repoCtrl = getRepoControllerInstance();
    const repo = await repoCtrl.getRepoByLanguage(language);

    const dto = repo.map((r) => convertToRepoDto(r));
    jsonResponse(res, New("successfull", null, 200, dto));
  } catch (error) {
    if (error instanceof Error) {
      jsonResponse(
        res,
        New("failed to get repo", new ApiError(error.message), 500, null),
      );
    }
    jsonResponse(
      res,
      New(
        "failed to get repo",
        new ApiError("internal server error"),
        500,
        null,
      ),
    );
  }
}

export async function getRepoWithMostStarsHandler(
  req: Request<RepoParams>,
  res: Response,
) {
  try {
    const repoCtrl = getRepoControllerInstance();
    const limit = req.params.limit ? parseInt(req.params.limit) : 1;
    const maxStars = await repoCtrl.getReposWithMostStars(limit);
    res.status(200).json(maxStars);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
