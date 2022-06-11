import { Request, Response, NextFunction } from "express";

export const XApiKeyAuth =
  (apiKey: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if ("x-api-key" in req.headers && req.headers["x-api-key"] === apiKey) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  };
