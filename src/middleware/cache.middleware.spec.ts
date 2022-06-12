import { getMockReq, getMockRes } from "@jest-mock/express";
import { cache } from "../middleware/cache.middleware";

describe("Cache middleware", () => {
  const req = getMockReq();
  const { res, next } = getMockRes();

  it("should call next because is a valid middleware", () => {
    process.env.CACHE = "true";
    req.body = {
      name: "middleware test",
    };
    cache("1 minute")(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
