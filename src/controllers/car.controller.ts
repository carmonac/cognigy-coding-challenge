import { NextFunction, Request, Response } from "express";
import Controller from "../decorators/controller";
import { Delete, Get, Post } from "../decorators/method";
import { Injectable } from "../decorators/injection";
import { CarService } from "../services/car.service";
import { Middleware } from "../decorators/middleware";
import { dataValidator } from "../middleware/validator.middleware";
import { xApiKeyAuth } from "../middleware/xapikey.middleware";
import { cache } from "../middleware/cache.middleware";
import { CarDTOSchema } from "../schemas/car.schema";
import config from "../config";

@Controller("/cars")
@Middleware(xApiKeyAuth(config.apiKey))
@Injectable()
export default class CarController {
  private carService: CarService;

  constructor(carService: CarService) {
    this.carService = carService;
  }

  @Get("")
  @Middleware(cache("1 minute"))
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cars = await this.carService.getCars();
      res.json(cars);
    } catch (error) {
      next(error);
    }
  }

  @Get("/:id")
  @Middleware(cache("1 minute"))
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const car = await this.carService.getCarById(req.params.id);
      res.json(car);
    } catch (error) {
      next(error);
    }
  }

  @Delete("/:id")
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.carService.deleteCarById(req.params.id);
      res.json({ message: "deleted car with id " + req.params.id });
    } catch (error) {
      next(error);
    }
  }

  @Post("")
  @Middleware(
    dataValidator(CarDTOSchema, [
      "brand",
      "model",
      "year",
      "color",
      "price",
      "hp",
    ])
  )
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newCar = await this.carService.createCar(req.body);
      res.status(201).json(newCar);
    } catch (error) {
      next(error);
    }
  }

  @Post("/:id")
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedCar = await this.carService.updateCarById(
        req.params.id,
        req.body
      );
      res.json(updatedCar);
    } catch (error) {
      next(error);
    }
  }
}
