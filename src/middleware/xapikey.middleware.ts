import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors";

export const xApiKeyAuth =
  (apiKey: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if ("x-api-key" in req.headers && req.headers["x-api-key"] === apiKey) {
      next();
    } else {
      next(new UnauthorizedError("Invalid API key"));
    }
  };
