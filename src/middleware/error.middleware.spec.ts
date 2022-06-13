import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from "../utils/errors";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { errorHandler } from "./error.middleware";

describe("ErrorHandler", () => {
  const req = getMockReq();
  const { res, next } = getMockRes();

  it("should call send with error message and status 400", () => {
    const error = new BadRequestError("Bad request");
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Bad request" });
  });

  it("should call send with error message and status 401", () => {
    const error = new UnauthorizedError("Unauthorized");
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should call send with error message and status 403", () => {
    const error = new ForbiddenError("Forbidden");
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
  });

  it("should call send with error message and status 404", () => {
    const error = new NotFoundError("Not found");
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
  });

  it("should call send with error message and status 500", () => {
    const error = new InternalServerError("Internal server error");
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
