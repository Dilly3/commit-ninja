import { getCommitControllerInstance } from "../../controller/commit";
import { Request, Response } from "express";
import { ApiError } from "../../error/app_error";
import { jsonResponse, New } from "../response";

export async function commitCountHandler(_: Request, res: Response) {
  try {
    const commitCtrl = getCommitControllerInstance();
    const autCount = await commitCtrl.getAuthoursCommitCount();
    jsonResponse(res, New("successful", null, 200, autCount));
  } catch (error) {
    if (error instanceof Error) {
      let errorObj: ApiError = new ApiError(error.message);
      jsonResponse(res, New("failed to get commit count", errorObj, 500, null));
    }
  }
}
