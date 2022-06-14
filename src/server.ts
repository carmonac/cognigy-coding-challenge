import "reflect-metadata";
import { ServerApp } from "./app";
import config from "./config";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import HomeController from "./controllers/home.controller";
import CarController from "./controllers/car.controller";
import logger from "./utils/logger";
import { DBConnection } from "./db.connection";
import { CarRepository } from "./repositories/car.repository";
import { CarService } from "./services/car.service";

const log = logger("server");

let app: ServerApp;

export const init = (): ServerApp => {
  DBConnection.connect();

  app = new ServerApp({
    globalMiddleware: [
      compression(),
      helmet(),
      cors(),
      morgan(config.morganFormat),
    ],
    controllers: [HomeController, CarController],
    providers: [CarRepository, CarService],
  });

  const { port } = config;
  app.start(port, () => {
    log.info(`Server started on port ${port}`);
  });
  return app;
};

export const end = async () => {
  await DBConnection.disconnect();
  app.stop((error) => {
    if (error) {
      log.error(error);
    } else {
      log.info("Server stopped");
    }
  });
};
