import { Request, Response } from "express";
import Controller from "../decorators/controller";
import { Get } from "../decorators/method";

@Controller("/")
export default class HomeController {
  @Get("")
  public index(req: Request, res: Response): void {
    res.send("Hello Cognigy!");
  }
}
