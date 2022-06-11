import { Request, Response, NextFunction } from "express";
import config from "../config";

export const XApiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // eslint-disable-next-line no-prototype-builtins
  if (
    "x-api-key" in req.headers &&
    req.headers["x-api-key"] === config.apiKey
  ) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
