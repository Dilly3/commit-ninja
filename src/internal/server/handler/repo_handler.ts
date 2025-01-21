import { convertToRepoDto } from "../../dtos/repo_dto";
import { getRepoControllerInstance } from "../../controller/repo";
import { Request, Response } from "express";

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
    res.status(200).json(dto);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRepoWithMostStarsHandler(req: Request<RepoParams>, res: Response) {
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
