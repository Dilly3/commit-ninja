import { Request, Response } from "express";
import { ErrInternalServer, InternalServerError, OK } from "../response";
import { ICommitRepository } from "../../repository/commit";

export function commitCountHandler(commitDB: ICommitRepository): any {
  return async function (_: Request, res: Response) {
    try {
      const autCount = await commitDB.getCommitCountsByAuthor();
      OK(res, autCount);
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
