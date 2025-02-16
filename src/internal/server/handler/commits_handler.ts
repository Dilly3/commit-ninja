import { Request, Response } from "express";
import { ApiError } from "../../error/app_error";
import {
  ErrInternalServer,
  httpInternalServerError,
  httpOK,
  jsonResponse,
  New,
} from "../response";
import { ICommitRepository } from "../../repository/commit";

export function commitCountHandler(commitDB: ICommitRepository): any {
  return async function (_: Request, res: Response) {
    try {
      const autCount = await commitDB.getCommitCountsByAuthor();
      jsonResponse(res, New("successful", null, httpOK, autCount));
      return;
    } catch (error) {
      if (error instanceof Error) {
        let errorObj: ApiError = new ApiError(error.message);
        jsonResponse(
          res,
          New(
            "failed to get commit count",
            errorObj,
            httpInternalServerError,
            null,
          ),
        );
        return;
      }
    }
    jsonResponse(
      res,
      New(
        "failed to get commit count",
        ErrInternalServer,
        httpInternalServerError,
        null,
      ),
    );
  };
}
