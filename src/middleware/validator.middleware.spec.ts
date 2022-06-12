import { dataValidator } from "./validator.middleware";
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
    dataValidator({
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
    dataValidator({
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

  it("should send error because year is greater than current year", () => {
    const currentYear = new Date().getFullYear();
    req.body = {
      year: 2023,
    };
    dataValidator({
      type: "object",
      properties: {
        year: { type: "number", maximum: currentYear },
      },
      required: ["year"],
    })(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalled();
  });
});
