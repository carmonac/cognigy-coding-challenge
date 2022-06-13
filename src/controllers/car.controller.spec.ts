import { CarRepository } from "../services/car.repository";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Injectable, Inject } from "../decorators/injection";
import mongoose from "mongoose";
import CarController from "./car.controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { ICar } from "../interfaces/car.interface";
import { CarSchema } from "../schemas/car.schema";

jest.mock("../decorators/injection", () => ({
  Injectable: jest.fn(() => jest.fn()),
  Inject: jest.fn(() => jest.fn()),
}));

describe("CarController", () => {
  const req = getMockReq();
  const { res, next } = getMockRes();
  const Car = mongoose.model<ICar>("Car", CarSchema);
  let carController: CarController;
  let carRepository: CarRepository;

  beforeEach(() => {
    carRepository = new CarRepository();
    carController = new CarController(carRepository);
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
    await carController.getAll(req, res, next);
    expect(res.json).toHaveBeenCalledWith(cars);
  });

  it("should return an error when get all cars", async () => {
    jest
      .spyOn(carRepository, "getAll")
      .mockImplementation(() => Promise.reject(new Error("Error")));
    await carController.getAll(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
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

    await carController.getById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(car);
  });

  it("should return an error when get car by id", async () => {
    req.params.id = "1";
    jest
      .spyOn(carRepository, "getById")
      .mockImplementation(() => Promise.reject(new Error("Error")));
    await carController.getById(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should delete car by id", async () => {
    const car = new Car({
      brand: "Ford",
      id: "23",
      name: "test car",
      color: "red",
      year: "2020",
    });
    jest
      .spyOn(carRepository, "getById")
      .mockImplementation(() => Promise.resolve(car));
    req.params.id = "23";
    jest
      .spyOn(carRepository, "deleteById")
      .mockImplementation(() => Promise.resolve());
    await carController.deleteById(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "deleted car with id " + req.params.id,
    });
  });

  it("should create car", async () => {
    const newCar = new Car({
      brand: "Ford",
      name: "test car",
      color: "red",
      year: "2020",
    });

    jest
      .spyOn(carRepository, "create")
      .mockImplementation(() => Promise.resolve(newCar));
    await carController.create(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.any(Car));
  });

  it("should return an error when create car", async () => {
    req.body = {
      brand: "Ford",
      name: "test car",
      color: "red",
      year: "2020",
    };
    jest
      .spyOn(carRepository, "create")
      .mockImplementation(() => Promise.reject(new Error("Error")));
    await carController.create(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return an error when create car", async () => {
    req.body = {
      brand: "Ford",
      name: "test car",
      color: "red",
      year: "2020",
    };
    jest
      .spyOn(carRepository, "create")
      .mockImplementation(() => Promise.reject(new Error("error")));
    await carController.create(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should update car", async () => {
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
    jest
      .spyOn(carRepository, "update")
      .mockImplementation(() => Promise.resolve(car));
    req.params.id = "1";
    req.body = {
      brand: "Ford",
      name: "test car",
      color: "red",
      year: "2020",
    };
    await carController.update(req, res, next);
    expect(res.json).toHaveBeenCalledWith(car);
  });

  it("should return error when update car", async () => {
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
    jest
      .spyOn(carRepository, "update")
      .mockImplementation(() => Promise.reject(new Error("error")));
    req.params.id = "1";
    req.body = {
      brand: "Ford",
      name: "test car",
      color: "red",
      year: "2020",
    };
    await carController.update(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
