import { xApiKeyAuth } from "./xapikey.middleware";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { UnauthorizedError } from "../utils/errors";

describe("XApiKeyMiddleware", () => {
  const req = getMockReq();
  const { res, next, clearMockRes } = getMockRes();

  beforeEach(() => {
    clearMockRes();
  });

  it("should allow to continue", () => {
    req.headers["x-api-key"] = "testApiKey";
    xApiKeyAuth("testApiKey")(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should send unauthorized response", () => {
    req.headers["x-api-key"] = "wrong";
    xApiKeyAuth("testApiKey")(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
