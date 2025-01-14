import { getCommitControllerInstance } from "../../controller/commit";
import { Request, Response } from "express";
import { ApiError } from "../../error/app_error";

export async function commitCountHandler(_: Request, res: Response) {
  try {
    const commitCtrl = getCommitControllerInstance();
    const autCount = await commitCtrl.getAuthoursCommitCount();
    res.status(200).json({ autCount });
  } catch (error) {
    if (error instanceof Error) {
      let errorObj: ApiError = new ApiError(error.message);
      res.status(500).json(errorObj);
    }
  }
}
