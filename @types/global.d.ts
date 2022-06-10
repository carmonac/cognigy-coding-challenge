import { Handler } from "express";

export {};

declare global {
  declare namespace CarApi {
    interface ServerOptions {
      globalMiddleware?: Handler[];
      Controllers?: any[];
      Services?: any[];
    }
  }
}
