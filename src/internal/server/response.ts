import { Response } from "express";

export const jsonResponse = (res: Response, code: number, data: any) => {
  res.status(code).json(data);
};
