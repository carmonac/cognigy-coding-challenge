import HomeController from "./home.controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("HomeController", () => {
  it("should return 'Hello World!'", () => {
    const controller = new HomeController();
    const req = getMockReq();
    const { res } = getMockRes();

    controller.index(req, res);
    expect(res.send).toHaveBeenCalledWith("Hello Cognigy!");
  });
});
