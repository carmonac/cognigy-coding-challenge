export class Container {
  private static registry: Map<string, any> = new Map();

  static register(key: string, instance: any): void {
    if (this.registry.has(key)) {
      return;
    }
    this.registry.set(key, instance);
    console.log(`${key} registered`);
  }

  static resolve<T>(key: string): T {
    if (!this.registry.has(key)) {
      throw new Error(`${key} not found`);
    }
    return this.registry.get(key);
  }
}
