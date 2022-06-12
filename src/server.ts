import { ServerApp } from "./app";
import config from "./config";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import HomeController from "./controllers/home.controller";
import CarController from "./controllers/car.controller";
import logger from "./utils/logger";
import DBConnection from "./services/db.service";
import CarService from "./services/car.service";

const log = logger("server");

let app: ServerApp;

export const init = () => {
  app = new ServerApp({
    globalMiddleware: [
      compression(),
      helmet(),
      cors(),
      morgan(config.morganFormat),
    ],
    controllers: [HomeController, CarController],
    services: [DBConnection, CarService],
  });

  const { port } = config;
  app.start(port, () => {
    log.info(`Server started on port ${port}`);
  });
};

export const end = () => {
  app.stop((error) => {
    if (error) {
      log.error(error);
    } else {
      log.info("Server stopped");
    }
  });
};
