export class Container {
  private static registry: Map<string, any> = new Map();

  static register(key: string, instance: any): void {
    if (this.registry.has(key)) {
      return;
    }
    this.registry.set(key, instance);
  }

  static resolve<T>(key: string): T {
    if (!this.registry.has(key)) {
      throw new Error(`${key} not found`);
    }
    return this.registry.get(key);
  }

  static unregisterAll(): void {
    for (const value of this.registry.values()) {
      if (value.finishInstance) {
        value.finishInstance();
      }
    }
    this.registry.clear();
  }
}
