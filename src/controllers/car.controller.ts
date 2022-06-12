import { Request, Response } from "express";
import Controller from "../decorators/controller";
import { Delete, Get, Post } from "../decorators/method";
import { Injectable, Inject } from "../decorators/injection";
import { CarRepository } from "../services/car.repository";
import { Middleware } from "../decorators/middleware";
import { dataValidator } from "../middleware/validator.middleware";
import { xApiKeyAuth } from "../middleware/xapikey.middleware";
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
  public async getAll(req: Request, res: Response): Promise<void> {
    const cars = await this.carRepository.getAllCars();
    res.json(cars);
  }

  @Get("/:id")
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async getById(req: Request, res: Response): Promise<void> {
    const car = await this.carRepository.getCarById(req.params.id);
    if (!car) {
      res.status(404).send("Car not found");
      return;
    }
    res.json(car);
  }

  @Delete("/:id")
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async deleteById(req: Request, res: Response): Promise<void> {
    const car = await this.carRepository.getCarById(req.params.id);
    if (!car) {
      res.status(404).send("Car not found");
      return;
    }
    await this.carRepository.deleteCar(req.params.id);
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
    const newCar = await this.carRepository.createCar(req.body);
    res.send(newCar);
  }

  @Post("/:id")
  @Middleware(dataValidator(CarDTOSchema, ["id"]))
  public async update(req: Request, res: Response): Promise<void> {
    const car = await this.carRepository.getCarById(req.params.id);
    if (!car) {
      res.status(404).send("Car not found");
      return;
    }
    const updatedCar = await this.carRepository.updateCar(
      req.params.id,
      req.body
    );
    res.json(updatedCar);
  }
}
