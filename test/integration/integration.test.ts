import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { init, end } from "../../src/server";
import { Application } from "express";
import config from "../../src/config";

describe("Integration tests", () => {
  let mongod: MongoMemoryServer;
  let app: Application;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = await mongod.getUri();

    config.mongo.uri = mongoUri;

    app = init().instance;
  });

  afterAll(async () => {
    end();
    mongod.stop({ force: true, doCleanup: true });
  }, 10000);

  it("should get Hello Cognigy", async () => {
    const { text } = await request(app).get("/").expect(200);
    expect(text).toBe("Hello Cognigy!");
  });

  it("should get OK", async () => {
    const { text } = await request(app).get("/healthcheck").expect(200);
    expect(text).toBe("OK");
  });

  it("should get 404 for unknown path", async () => {
    const { body } = await request(app).post("/").expect(404);
    expect(body).toEqual({ message: "Not found" });
  });

  it("should get an unauthorized error", async () => {
    const { body } = await request(app).get("/cars").expect(401);
    expect(body).toEqual({ message: "Invalid API key" });
  });

  it("should get an empty list of cars", async () => {
    const { body } = await request(app)
      .get("/cars")
      .set("x-api-key", "cognigy.ai_123")
      .expect(200);
    expect(body).toEqual([]);
  });

  it("should not find any car with id 62a6312065b15aaf0e949035", async () => {
    const { body } = await request(app)
      .get("/cars/62a6312065b15aaf0e949035")
      .set("x-api-key", "cognigy.ai_123")
      .expect(404);
    expect(body).toEqual({ message: "Car not found" });
  });

  let carId: string = "";
  it("should create a new car", async () => {
    const { body } = await request(app)
      .post("/cars")
      .set("x-api-key", "cognigy.ai_123")
      .send({
        brand: "Ford",
        model: "Mustang",
        year: 1969,
        color: "red",
        price: 100000,
        hp: 200,
      })
      .expect(201);
    carId = body._id;
    expect(body).toEqual({
      brand: "Ford",
      model: "Mustang",
      year: 1969,
      color: "red",
      price: 100000,
      hp: 200,
      _id: expect.any(String),
      createAt: expect.any(String),
      __v: 0,
    });
  });

  it("should get all cars", async () => {
    const { body } = await request(app)
      .get("/cars")
      .set("x-api-key", "cognigy.ai_123")
      .expect(200);
    expect(body).toEqual([
      {
        brand: "Ford",
        model: "Mustang",
        year: 1969,
        color: "red",
        price: 100000,
        hp: 200,
        _id: expect.any(String),
        createAt: expect.any(String),
        __v: 0,
      },
    ]);
  });

  it(`should get a car with id ${carId}`, async () => {
    const { body } = await request(app)
      .get(`/cars/${carId}`)
      .set("x-api-key", "cognigy.ai_123")
      .expect(200);
    expect(body).toEqual({
      brand: "Ford",
      model: "Mustang",
      year: 1969,
      color: "red",
      price: 100000,
      hp: 200,
      _id: expect.any(String),
      createAt: expect.any(String),
      __v: 0,
    });
  });

  it("should update a car", async () => {
    const { body } = await request(app)
      .post(`/cars/${carId}`)
      .set("x-api-key", "cognigy.ai_123")
      .send({
        brand: "Ford",
        model: "Mustang",
        year: 1969,
        color: "red",
        price: 85000,
        hp: 200,
      });
    expect(body).toEqual({
      brand: "Ford",
      model: "Mustang",
      year: 1969,
      color: "red",
      price: 85000,
      hp: 200,
      _id: expect.any(String),
      createAt: expect.any(String),
      __v: 0,
    });
  });

  it("should delete a car", async () => {
    const { body } = await request(app)
      .delete(`/cars/${carId}`)
      .set("x-api-key", "cognigy.ai_123")
      .expect(200);
    expect(body).toEqual({ message: "deleted car with id " + carId });
  });

  it("should get an empty list of cars after deleting car", async () => {
    const { body } = await request(app)
      .get("/cars")
      .set("x-api-key", "cognigy.ai_123")
      .expect(200);
    expect(body).toEqual([]);
  });

  it("should receive a BadRequestError creating a new car", async () => {
    const { body } = await request(app)
      .post("/cars")
      .set("x-api-key", "cognigy.ai_123")
      .send({
        brand: "Ford",
        model: "Mustang",
        year: 1969,
      })
      .expect(400);
    expect(body).toEqual({ message: expect.any(String) });
  });

  it("should receive a BadRequestError updating a car", async () => {
    const { body } = await request(app)
      .post(`/cars/${carId}`)
      .set("x-api-key", "cognigy.ai_123")
      .send({
        smell: "good",
      })
      .expect(400);
    expect(body).toEqual({ message: expect.any(String) });
  });

  it("should receive a BadRequestError  deleting a car", async () => {
    const { body } = await request(app)
      .delete(`/cars/123`)
      .set("x-api-key", "cognigy.ai_123")
      .expect(400);
    expect(body).toEqual({ message: expect.any(String) });
  });

  it("should receive a BadRequestError getting a car", async () => {
    const { body } = await request(app)
      .get(`/cars/123`)
      .set("x-api-key", "cognigy.ai_123")
      .expect(400);
    expect(body).toEqual({ message: expect.any(String) });
  });
});
