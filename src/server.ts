import { ServerApp } from "./app";
import config from "./config";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import HomeController from "./controllers/home.controller";

let app: ServerApp;

export const init = () => {
  app = new ServerApp({
    globalMiddleware: [
      compression(),
      helmet(),
      cors(),
      morgan(config.morganFormat),
    ],
    controllers: [HomeController],
    services: [],
  });

  const { port } = config;
  app.start(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

export const end = () => {
  app.stop((error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Server stopped");
    }
  });
};
