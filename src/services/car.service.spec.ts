import { CarService } from "../services/car.service";
import { CarRepository } from "../repositories/car.repository";
import mongoose from "mongoose";
import { ICar } from "../interfaces/car.interface";
import { CarSchema } from "../schemas/car.schema";

jest.mock("../decorators/injection", () => ({
  Injectable: jest.fn(() => jest.fn()),
}));

describe("CarService", () => {
  const Car = mongoose.model<ICar>("Car", CarSchema);
  let carRepository: CarRepository;
  let carService: CarService;

  beforeEach(() => {
    jest.clearAllMocks();
    carRepository = new CarRepository();
    carService = new CarService(carRepository);
  });

  it("should get all cars", async () => {
    const cars = [
      new Car({
        brand: "Ford",
        id: "1",
        name: "test car",
        color: "red",
        year: "2020",
      }),
      new Car({
        brand: "Ford",
        id: "2",
        name: "test car 2",
        color: "blue",
        year: "2021",
      }),
    ];
    jest
      .spyOn(carRepository, "getAll")
      .mockImplementation(() => Promise.resolve(cars));
    const result = await carService.getCars();
    expect(result).toEqual(cars);
  });

  it("should get car by id", async () => {
    const car = new Car({
      brand: "Ford",
      id: "1",
      name: "test car",
      color: "red",
      year: "2020",
    });
    jest
      .spyOn(carRepository, "getById")
      .mockImplementation(() => Promise.resolve(car));
    const result = await carService.getCarById("1");
    expect(result).toEqual(car);
  });

  it("should return an error when get car by id", async () => {
    jest
      .spyOn(carRepository, "getById")
      .mockImplementation(() => Promise.resolve(null));

    await expect(carService.getCarById("1")).rejects.toThrow("Car not found");
  });

  it("should create car", async () => {
    const car = new Car({
      brand: "Ford",
      id: "1",
      name: "test car",
      color: "red",
      year: "2020",
    });
    jest
      .spyOn(carRepository, "create")
      .mockImplementation(() => Promise.resolve(car));
    const result = await carService.createCar(car);
    expect(result).toEqual(car);
  });

  it("should return an error when create car", async () => {
    jest
      .spyOn(carRepository, "create")
      .mockImplementation(() => Promise.reject(new Error("Error")));
    await expect(carService.createCar(new Car({}))).rejects.toThrow("Error");
  });

  it("should delete car by id", async () => {
    const car = new Car({
      brand: "Ford",
      id: "62a8dd2e8e0575a68348bc64",
      name: "test car",
      color: "red",
      year: "2020",
    });
    jest
      .spyOn(carRepository, "getById")
      .mockImplementation(() => Promise.resolve(car));

    jest
      .spyOn(carRepository, "deleteById")
      .mockImplementation(() => Promise.resolve());
    await carService.deleteCarById("62a8dd2e8e0575a68348bc64");
    expect(carRepository.deleteById).toHaveBeenCalled();
  });

  it("should return an error when delete car by id", async () => {
    jest
      .spyOn(carRepository, "deleteById")
      .mockImplementation(() => Promise.reject(new Error("Error")));
    await expect(carService.deleteCarById("1")).rejects.toThrow(
      expect.any(Error)
    );
  });

  it("should update car by id", async () => {
    const car = new Car({
      brand: "Ford",
      id: "62a8dd2e8e0575a68348bc64",
      name: "test car",
      color: "red",
      year: "2020",
    });
    jest
      .spyOn(carRepository, "getById")
      .mockImplementation(() => Promise.resolve(car));
    jest
      .spyOn(carRepository, "update")
      .mockImplementation(() => Promise.resolve(car));
    const result = await carService.updateCarById(
      "62a8dd2e8e0575a68348bc64",
      car
    );
    expect(result).toEqual(car);
  });

  it("should return an error when update car by id", async () => {
    jest
      .spyOn(carRepository, "update")
      .mockImplementation(() => Promise.reject(new Error("Error")));
    await expect(carService.updateCarById("1", new Car({}))).rejects.toThrow(
      expect.any(Error)
    );
  });
});
