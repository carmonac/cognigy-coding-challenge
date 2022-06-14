import { ICar } from "../interfaces/car.interface";
import { CarRepository } from "../repositories/car.repository";
import { NotFoundError } from "../utils/errors";
import { Injectable } from "../decorators/injection";

@Injectable()
export class CarService {
  private carRepository: CarRepository;

  constructor(carRepository: CarRepository) {
    this.carRepository = carRepository;
  }

  public async getCars(): Promise<Partial<ICar[]>> {
    return this.carRepository.getAll({ _id: 1, brand: 1, model: 1, year: 1 });
  }

  public async getCarById(id: string): Promise<ICar> {
    const car = await this.carRepository.getById(id);
    if (!car) throw new NotFoundError("Car not found");
    return car;
  }

  public async deleteCarById(id: string): Promise<void> {
    const car = await this.getCarById(id);
    if (!car) throw new NotFoundError("Car not found");
    this.carRepository.deleteById(id);
  }

  public async createCar(car: ICar): Promise<ICar> {
    return this.carRepository.create(car);
  }

  public async updateCarById(id: string, car: ICar): Promise<ICar> {
    const carFound = await this.getCarById(id);
    if (!carFound) throw new NotFoundError("Car not found");
    const updated = await this.carRepository.update(id, car);
    if (!updated) throw new Error("Car not updated");
    return updated;
  }
}
