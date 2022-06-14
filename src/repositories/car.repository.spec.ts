import { MongoMemoryServer } from "mongodb-memory-server";
import { CarRepository } from "./car.repository";
import mongoose from "mongoose";
import { ICar } from "../interfaces/car.interface";
import { CarSchema } from "../schemas/car.schema";

describe("Car repository", () => {
  let mongod: MongoMemoryServer;
  let carRepository: CarRepository;
  const Car = mongoose.model<ICar>("Car", CarSchema);

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = await mongod.getUri();

    mongoose.connect(mongoUri);
    carRepository = new CarRepository();
  });

  it("should create a new car", async () => {
    const car = new Car({
      brand: "Ford",
      model: "Mustang",
      year: 1969,
      color: "red",
      price: 100000,
      hp: 200,
    });

    const createdCar = await carRepository.create(car);
    expect(createdCar).toBeDefined();
  });

  it("should get all cars", async () => {
    const cars = await carRepository.getAll({ model: 1 });
    expect(cars.length).toBeGreaterThan(0);
  });

  it("should get a car by id", async () => {
    const cars = await carRepository.getAll({ _id: 1, model: 1 });
    const car = await carRepository.getById(cars[0]?._id);
    expect(car).toBeDefined();
  });

  it("should delete a car by id", async () => {
    const cars = await carRepository.getAll({ _id: 1, model: 1 });
    const car = await carRepository.getById(cars[0]?._id);
    if (!car) {
      throw new Error("Car not found");
    }
    await carRepository.deleteById(cars[0]?._id);
    const deletedCar = await carRepository.getById(cars[0]?._id);
    expect(deletedCar).toBe(null);
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongod.stop({ force: true, doCleanup: true });
  });
});
