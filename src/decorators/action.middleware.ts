import { MetadataKeys } from "../utils/metadata.keys";
import { RequestParamHandler } from "express";

export const ActionMiddleware =
  (middleware: RequestParamHandler): MethodDecorator =>
  (target: any, propertyKey: string | symbol): void => {
    const middlewareList: RequestParamHandler[] = Reflect.hasMetadata(
      MetadataKeys.MIDDLEWARE,
      target,
      propertyKey
    )
      ? Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, propertyKey)
      : [];

    middlewareList.push(middleware);
    Reflect.defineMetadata(
      MetadataKeys.MIDDLEWARE,
      middlewareList,
      target,
      propertyKey
    );
  };
