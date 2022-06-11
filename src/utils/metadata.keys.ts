import { Methods } from "./methods.enum";

export enum MetadataKeys {
  ROUTE_PATH = "route_path",
  ROUTERS = "routers",
  MIDDLEWARE = "middleware",
}

export type RouterData = {
  method: Methods;
  path: string;
  handlerName: string | symbol;
};