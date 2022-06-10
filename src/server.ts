import { ServerApp } from "./app";
import config from "./config";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

let app: ServerApp;

export const init = async () => {
    app = new ServerApp({
        globalMiddleware: [
            compression(),
            helmet(),
            cors(),
            morgan(config.morganFormat),
        ],
        Controllers: [],
        Services: []
    });

    app.start(config.port);
};

export const end = async () => {
    app.stop();
};