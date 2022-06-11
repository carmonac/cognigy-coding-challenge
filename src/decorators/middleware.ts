import { MetadataKeys } from "../utils/metadata.keys";
import { RequestParamHandler } from "express";

export const Middleware =
  (middleware: RequestParamHandler): MethodDecorator & ClassDecorator =>
  (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ): void => {
    if (descriptor) {
      // method decorator
      const middlewareList: RequestParamHandler[] = Reflect.hasMetadata(
        MetadataKeys.MIDDLEWARE,
        target,
        propertyKey!
      )
        ? Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, propertyKey!)
        : [];

      middlewareList.push(middleware);
      Reflect.defineMetadata(
        MetadataKeys.MIDDLEWARE,
        middlewareList,
        target,
        propertyKey!
      );
    } else {
      // class decorator
      const middlewareList: RequestParamHandler[] = Reflect.hasMetadata(
        MetadataKeys.MIDDLEWARE,
        target
      )
        ? Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target)
        : [];

      middlewareList.push(middleware);
      Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, middlewareList, target);
    }
  };
