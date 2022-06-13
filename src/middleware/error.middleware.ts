import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from "../utils/errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof InternalServerError
  ) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};
