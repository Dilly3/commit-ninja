import { ApiError } from "../error/app_error";
import { jsonResponse } from "./response";
import { commitCtrl } from "../controller/commit";

import express, { Request, Response } from "express";

export const commitRouter = express.Router();

commitRouter.get("/count", async (_: Request, res: Response) => {
  try {
    const autCount = await commitCtrl.getAuthoursCommitCount();
    jsonResponse(res, 200, { autCount });
  } catch (error) {
    if (error instanceof Error) {
      let errorObj: ApiError = new ApiError(error.message);
      jsonResponse(res, 500, errorObj);
    }
  }
});
