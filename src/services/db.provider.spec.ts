import { MongoMemoryServer } from "mongodb-memory-server";
import { DBConnection } from "./db.provider";
import mongoose from "mongoose";
import config from "../config";

mongoose.connection.on = jest.fn();

describe("DB provider", () => {
  let mongod: MongoMemoryServer;
  let dbConnection: DBConnection;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = await mongod.getUri();
    config.mongo.uri = mongoUri;
    dbConnection = new DBConnection();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await dbConnection.finishInstance();
    await mongod.stop({ force: true, doCleanup: true });
  });

  it("should connect to mongo", () => {
    expect(mongoose.connection.on).toHaveBeenCalledWith(
      "connected",
      expect.any(Function)
    );
  });
});
