import { Request, Response } from "express";
import Controller from "../decorators/controller";
import { Delete, Get, Post } from "../decorators/method";
import { Injectable, Inject } from "../decorators/injection";
import { CarRepository } from "../services/car.repository";
import { Middleware } from "../decorators/middleware";
import { dataValidator } from "../middleware/validator.middleware";
import { xApiKeyAuth } from "../middleware/xapikey.middleware";
import { cache } from "../middleware/cache.middleware";
import { CarDTOSchema } from "../schemas/car.schema";
import config from "../config";

@Controller("/cars")
@Middleware(xApiKeyAuth(config.apiKey))
@Injectable
export default class CarController {
  private carRepository: CarRepository;

  constructor(@Inject("CarRepository") carRepository?: CarRepository) {
    this.carRepository = carRepository!;
  }

  @Get("")
  @Middleware(cache("1 minute"))
  public async getAll(req: Request, res: Response): Promise<void> {
    const cars = await this.carRepository.getAll();
    res.json(cars);
  }

  @Get("/:id")
  @Middleware(cache("1 minute"))
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async getById(req: Request, res: Response): Promise<void> {
    const car = await this.carRepository.getById(req.params.id);
    if (!car) {
      res.status(404).send("Car not found");
      return;
    }
    res.json(car);
  }

  @Delete("/:id")
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async deleteById(req: Request, res: Response): Promise<void> {
    const car = await this.carRepository.getById(req.params.id);
    if (!car) {
      res.status(404).send("Car not found");
      return;
    }
    await this.carRepository.deleteById(req.params.id);
    res.send({ message: "deleted car with id " + req.params.id });
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
  public async create(req: Request, res: Response): Promise<void> {
    const newCar = await this.carRepository.create(req.body);
    res.send(newCar);
  }

  @Post("/:id")
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async update(req: Request, res: Response): Promise<void> {
    const car = await this.carRepository.getById(req.params.id);
    if (!car) {
      res.status(404).send("Car not found");
      return;
    }
    const updatedCar = await this.carRepository.update(req.params.id, req.body);
    res.json(updatedCar);
  }
}
