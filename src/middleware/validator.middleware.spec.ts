import { DataValidator } from "./validator.middleware";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("DataValidator", () => {
  const req = getMockReq();
  const { res, next, clearMockRes } = getMockRes();

  beforeEach(() => {
    clearMockRes();
  });

  it("should call next because data is correct", () => {
    req.body = {
      name: "John Doe",
      age: 30,
    };
    DataValidator({
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    })(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should send error because data is incorrect", () => {
    req.body = {
      year: "2022",
    };
    DataValidator({
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    })(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalled();
  });
});
