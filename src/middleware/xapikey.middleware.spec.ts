import { xApiKeyAuth } from "./xapikey.middleware";
import { getMockReq, getMockRes } from "@jest-mock/express";

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
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Unauthorized");
  });
});
