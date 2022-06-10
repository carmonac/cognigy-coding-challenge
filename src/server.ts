import { ServerApp } from "./app";
import config from "./config";

let app: ServerApp;

export const init = async () => {
    app = new ServerApp({
        globalMiddleware: [],
        Controllers: [],
        Services: []
    });

    app.start(config.port);
};

export const end = async () => {
    app.stop();
};