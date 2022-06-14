import { Injectable } from "./injection";
import { Injection } from "../interfaces/injection.interface";

type TestItem = { id: number; name: string };
class TestService {
  getAll(): TestItem[] {
    return [{ id: 1, name: "test" }];
  }
}

describe("Injection", () => {
  it("should inject a dependency in the class", () => {
    @Injectable()
    class TestController {
      testService: TestService;

      constructor(testService: TestService) {
        this.testService = testService;
      }

      getAllItems(): TestItem[] {
        return this.testService.getAll();
      }
    }

    const injections: Injection[] = Reflect.getMetadata(
      "injections",
      TestController
    );
    expect(injections[0].key).toBe("TestService");
  });
});
