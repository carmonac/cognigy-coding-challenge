import mongoose from "mongoose";
import { ICar } from "../interfaces/car.interface";
import { CarSchema } from "../schemas/car.schema";
import logger from "../utils/logger";

const log = logger("car-service");

export default class CarService {
  private Car?: mongoose.Model<ICar>;

  public async getAllCars(): Promise<ICar[]> {
    return this.Car!.find();
  }

  public async getCarById(id: string): Promise<ICar | null> {
    const car = await this.Car!.findById(id);
    return car;
  }

  public async createCar(car: ICar): Promise<ICar> {
    const newCar = new this.Car!(car);
    return newCar.save();
  }

  public async updateCar(id: string, car: ICar): Promise<ICar | null> {
    const updatedCar = await this.Car!.findByIdAndUpdate(id, car, { new: true });
    return updatedCar;
  }

  constructor() {
    this.Car = mongoose.model<ICar>("Car", CarSchema);
    log.info("Car mongo model created");
  }
}