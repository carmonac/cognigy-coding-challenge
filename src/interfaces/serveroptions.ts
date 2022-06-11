import { Handler } from "express";

export interface ServerOptions {
  globalMiddleware?: Handler[];
  Controllers?: any[];
  Services?: any[];
}