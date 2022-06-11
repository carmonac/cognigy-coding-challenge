import { Handler } from "express";

export interface ServerOptions {
  globalMiddleware?: Handler[];
  controllers?: any[];
  services?: any[];
}
