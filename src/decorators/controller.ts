import { MetadataKeys } from "../utils/metadata.keys";

const Controller =
  (path: string): ClassDecorator =>
  (target: Function): void => {
    Reflect.defineMetadata(MetadataKeys.ROUTE_PATH, path, target);
  };

export default Controller;
