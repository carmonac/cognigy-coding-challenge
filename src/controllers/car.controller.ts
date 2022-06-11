import { Request, Response } from "express";
import Controller from "../decorators/controller";
import { Delete, Get, Post } from "../decorators/method";

@Controller("/cars")
export default class CarController {
  @Get("")
  public index(req: Request, res: Response): void {
    res.send("all cars");
  }

  @Get("/:id")
  public getCar(req: Request, res: Response): void {
    res.send("car with id " + req.params.id);
  }

  @Delete("/:id")
  public deleteCar(req: Request, res: Response): void {
    res.send("deleted car with id " + req.params.id);
  }

  @Post("")
  public createCar(req: Request, res: Response): void {
    res.send("created car");
  }

  @Post("/:id")
  public updateCar(req: Request, res: Response): void {
    res.send("updated car with id " + req.params.id);
  }
}
