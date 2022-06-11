import { RequestParamHandler } from "express";
import { MetadataKeys } from "../utils/metadata.keys";

export const ControllerMiddleware =
  (middleware: RequestParamHandler): ClassDecorator =>
  (target: Function): void => {
    const middlewareList: RequestParamHandler[] = Reflect.hasMetadata(
      MetadataKeys.MIDDLEWARE,
      target
    )
      ? Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target)
      : [];

    middlewareList.push(middleware);
    Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, middlewareList, target);
  };
