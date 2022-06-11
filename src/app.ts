import express, { Application, Handler, Router } from "express";
import { Server } from "http";
import { ServerOptions } from "./interfaces/serveroptions";
import { MetadataKeys, RouterData } from "./utils/metadata.keys";
import { Container } from "./utils/container";

export class ServerApp {
  private readonly _instance: Application;
  private process!: Server;

  constructor(options: ServerOptions) {
    this._instance = express();
    this.registerGlobalMiddleware(options.globalMiddleware);
    this.registerControllers(options.controllers);
    this.registerServices(options.services);
  }

  get instance(): Application {
    return this._instance;
  }

  public start(port: number, callback?: () => void): void {
    this.process = this._instance.listen(port, callback);
  }

  public stop(callback: ((err?: Error | undefined) => void) | undefined): void {
    this.process.close(callback);
  }

  private registerGlobalMiddleware(middleware: Handler[] | undefined): void {
    // default middleware
    this._instance.use(express.json());
    this._instance.use(express.urlencoded({ extended: true }));
    // global middleware
    if (middleware) {
      middleware.forEach((m) => this._instance.use(m));
    }
  }

  private registerServices(services: any[] | undefined): void {
    if (!services) {
      console.info("No services registered");
      return;
    }
    services.forEach((ServiceClass) => {
      const instance = new ServiceClass();
      Container.register(ServiceClass.name, instance);
    });
  }

  private registerControllers(controllers: any[] | undefined): void {
    if (!controllers) {
      console.info("No controllers registered");
      return;
    }
    const infoRoutes: Array<{ method: string; path: string; handler: string }> =
      [];
    controllers.forEach((ControllerClass) => {
      const controllerInstance: { [handleName: string]: Handler } =
        new ControllerClass() as any;
      // get base path from controller class
      const basePath: string = Reflect.getMetadata(
        MetadataKeys.ROUTE_PATH,
        ControllerClass
      );
      // get all router data from controller class
      const routers: RouterData[] = Reflect.getMetadata(
        MetadataKeys.ROUTERS,
        ControllerClass
      );
      // register all routers
      const expressRouter: Router = express.Router();
      routers.forEach(({ method, path, handlerName }) => {
        // check for actions middleware
        const middleware: Handler[] = Reflect.getMetadata(
          MetadataKeys.MIDDLEWARE,
          controllerInstance,
          handlerName
        );

        const handlerNameString = String(handlerName);
        if (middleware && middleware.length > 0) {
          expressRouter[method](
            path,
            ...middleware,
            controllerInstance[handlerNameString].bind(controllerInstance)
          );
        } else {
          expressRouter[method](
            path,
            controllerInstance[handlerNameString].bind(controllerInstance)
          );
        }
        infoRoutes.push({
          method,
          path: `${basePath}${path}`,
          handler: `${ControllerClass.name}.${handlerNameString}`,
        });
      });
      // get all middleware functions from controller class
      const controllerMiddleware = Reflect.getMetadata(
        MetadataKeys.MIDDLEWARE,
        ControllerClass
      );

      // register router
      if (controllerMiddleware && controllerMiddleware.length > 0) {
        this._instance.use(basePath, ...controllerMiddleware, expressRouter);
      } else {
        this._instance.use(basePath, expressRouter);
      }
    });
    console.table(infoRoutes);
  }
}
