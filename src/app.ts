import express, {
  Application,
  Handler,
  NextFunction,
  Router,
  Request,
  Response,
} from "express";
import { Server } from "http";
import { ServerOptions } from "./interfaces/serveroptions.interface";
import { Injection } from "./interfaces/injection.interface";
import { MetadataKeys, RouterData } from "./utils/metadata.keys";
import { Container } from "./utils/container";
import { errorHandler } from "./middleware/error.middleware";
import { NotFoundError } from "./utils/errors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./swagger-cars.yml");

export class ServerApp {
  private readonly _instance: Application;
  private process!: Server;

  constructor(options: ServerOptions) {
    this._instance = express();
    // default middleware
    this._instance.use(express.json());
    this._instance.use(express.urlencoded({ extended: true }));
    // register global middleware
    options.globalMiddleware &&
      this.registerGlobalMiddleware(options.globalMiddleware);
    // register services
    options.providers && this.registerProviders(options.providers);
    // register controllers
    options.controllers && this.registerControllers(options.controllers);
    // register swagger
    this._instance.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    // register error handler
    this._instance.use(this.notFound);
    this._instance.use(errorHandler);
  }

  get instance(): Application {
    return this._instance;
  }

  public start(port: number, callback?: () => void): void {
    this.process = this._instance.listen(port, callback);
  }

  public stop(callback: ((err?: Error | undefined) => void) | undefined): void {
    this.unregisterProviders();
    this.process.close(callback);
  }

  private registerGlobalMiddleware = (middleware: Handler[]): void =>
    middleware.forEach((m) => this._instance.use(m));

  private registerProviders(providers: any[]): void {
    providers.forEach((ProviderClass) => {
      const instance = this.createClassInstance(ProviderClass);
      Container.register(ProviderClass.name, instance);
    });
  }

  private unregisterProviders(): void {
    Container.unregisterAll();
  }

  private registerControllers(controllers: any[]): void {
    const infoRoutes: Array<{ method: string; path: string; handler: string }> =
      [];
    controllers.forEach((ControllerClass) => {
      const controllerInstance = this.createClassInstance(ControllerClass);

      const basePath: string = this.extractMetadataFromController(
        MetadataKeys.ROUTE_PATH,
        ControllerClass
      );
      const routers: RouterData[] = this.extractMetadataFromController(
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

        expressRouter[method](
          path,
          ...(middleware?.length > 0 ? middleware : []),
          controllerInstance[String(handlerName)].bind(controllerInstance)
        );

        infoRoutes.push({
          method,
          path: `${basePath}${path}`,
          handler: `${ControllerClass.name}.${String(handlerName)}`,
        });
      });

      // get all middleware functions from controller class
      const controllerMiddleware = this.extractMetadataFromController(
        MetadataKeys.MIDDLEWARE,
        ControllerClass
      );

      this._instance.use(
        basePath,
        ...(controllerMiddleware?.length > 0 ? controllerMiddleware : []),
        expressRouter
      );
    });
    console.table(infoRoutes);
  }

  private extractMetadataFromController = (
    key: string,
    ControllerClass: any
  ): any => Reflect.getMetadata(key, ControllerClass);

  private notFound: Handler = (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    next(new NotFoundError("Not found"));
  };

  private createClassInstance(Class: any): any {
    const injections: Injection[] = this.extractMetadataFromController(
      MetadataKeys.INJECTIONS,
      Class
    );

    return injections
      ? new Class(
          ...injections.map((injection: Injection) =>
            Container.resolve(injection.key)
          )
        )
      : new Class();
  }
}
