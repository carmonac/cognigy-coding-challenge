import { MongoMemoryServer } from 'mongodb-memory-server';
import { DBConnection } from './db.provider';
import mongoose from 'mongoose';

mongoose.connection.on = jest.fn();

describe("DB provider", () => {
  let mongod: MongoMemoryServer;
  let dbConnection: DBConnection;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = await mongod.getUri();

    jest.mock("../config", () => ({
      mongo: {
        uri: mongoUri,
      }
    }));
    dbConnection = new DBConnection();
  });

  it("should connect to mongo", () => {

    expect(mongoose.connection.on).toHaveBeenCalledWith("connected", expect.any(Function));

  });

  afterAll(async () => {
    dbConnection.finishInstance();
    await mongod.stop({ force: true, doCleanup: true });
  });

});