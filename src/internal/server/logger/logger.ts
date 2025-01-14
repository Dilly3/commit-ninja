import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

chalk.level = 2;

function colorizeMethod(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return chalk.green(method);
    case "POST":
      return chalk.yellow(method);
    case "PUT":
      return chalk.blue(method);
    case "DELETE":
      return chalk.red(method);
    default:
      return chalk.white(method);
  }
}
export function loggerMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const method = colorizeMethod(req.method);
  const time = new Date(Date.now()).toString();
  console.log(
    `Method:${method}, Host:${chalk.yellow(req.hostname)}, ` +
      `Path: ${chalk.blue(req.path)}, ` +
      `User-Agent: ${chalk.magenta(req.get("user-agent") || "none")}, ` +
      `Time: ${chalk.bgCyan(time)}`,
  );
  next();
}
