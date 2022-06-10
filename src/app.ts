import express, { Application, Handler } from 'express';
import { Server } from 'http';

export class ServerApp {
    private readonly _instance: Application;
    private process!: Server;

    constructor(options: CarApi.ServerOptions) {
        this._instance = express();
        this.registerGlobalMiddleware(options.globalMiddleware);
    }

    get instance(): Application {
        return this._instance;
    }

    public start(port: number): void {
        this.process = this._instance.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }

    public stop(): void {
        this.process.close();
    }

    private registerGlobalMiddleware(middleware: Handler[] | undefined): void {
        // default middleware
        this._instance.use(express.json());
        this._instance.use(express.urlencoded({ extended: true }));
        // global middleware
        if (middleware) {
            middleware.forEach(m => this._instance.use(m));
        }
    }

    // private registerServices(services: any[]): void {}

    // private registerControllers(controllers: any[]): void {

    // }


}