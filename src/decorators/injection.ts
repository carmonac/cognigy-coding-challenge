import { Injection } from "../interfaces/injection.interface";

export const Injectable =
  (): ClassDecorator =>
  (target: Function): void => {
    const types = Reflect.getMetadata("design:paramtypes", target);
    if (types?.length > 0) {
      const injections: Injection[] = types.map(
        (type: { name: string }, index: number) => ({ index, key: type.name })
      );
      Reflect.defineMetadata("injections", injections, target);
    }
  };
