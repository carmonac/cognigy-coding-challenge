import { Container } from "../utils/container";

interface Injection {
  index: number;
  key: string;
}

export const Injectable = <T extends { new (...args: any[]): {} }>(
  constructor: T
): T | void =>
  class extends constructor {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(..._args: any[]) {
      const injections = (constructor as any).injections as Injection[];
      const injectedArgs: any[] = injections.map(({ key }) =>
        Container.resolve(key)
      );
      super(...injectedArgs);
    }
  };

export const Inject =
  (key: string) =>
  (target: Object, _propertyKey: string | symbol, parameterIndex: number) => {
    const injection: Injection = { index: parameterIndex, key };
    const existingInjections: Injection[] = (target as any).injections || [];
    Object.defineProperty(target, "injections", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: [...existingInjections, injection],
    });
  };
