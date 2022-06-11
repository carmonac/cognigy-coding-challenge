import { Methods } from "../utils/methods.enum";
import { MetadataKeys, RouterData } from "../utils/metadata.keys";

const methodDecoratorFactory =
  (method: Methods) =>
  (path: string): MethodDecorator =>
  (target: any, propertyKey: string | symbol): void => {
    const controllerClass = target.constructor;

    const routers: RouterData[] = Reflect.hasMetadata(
      MetadataKeys.ROUTERS,
      controllerClass
    )
      ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
      : [];

    routers.push({
      method,
      path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass);
  };

export const Get = methodDecoratorFactory(Methods.GET);
export const Post = methodDecoratorFactory(Methods.POST);
export const Put = methodDecoratorFactory(Methods.PUT);
export const Delete = methodDecoratorFactory(Methods.DELETE);
export const Patch = methodDecoratorFactory(Methods.PATCH);
