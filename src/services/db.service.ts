import mongoose from "mongoose";
import config from "../config";
import logger from "../utils/logger";

const log = logger("db");

export default class DBConnection {
  constructor() {
    log.info("Connecting to mongoose");
    mongoose.connect(config.mongo.uri);
    mongoose.connection.on("connected", () => {
      log.info("Mongoose connected");
    });
    mongoose.connection.on("error", (error) => {
      log.error(error);
    });
    mongoose.connection.on("disconnected", () => {
      log.info("Mongoose disconnected");
    });
  }

  public finishInstance(): void {
    log.info("Mongoose disconnecting");
    mongoose.disconnect();
  }
}