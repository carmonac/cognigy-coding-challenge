import { Injectable, Inject } from "./injection";
import { Container } from "../utils/container";

type TestItem = { id: number; name: string };

class TestRepository {
  getAll(): TestItem[] {
    return [{ id: 1, name: "test" }];
  }
}

Container.register("TestRepository", new TestRepository());

describe("Injection", () => {
  it("should inject a dependency in the class", () => {
    @Injectable()
    class TestController {
      testRepository: TestRepository;

      constructor(@Inject("TestRepository") testRepository?: TestRepository) {
        if (!testRepository) {
          throw new Error("testRepository is not defined");
        }

        this.testRepository = testRepository;
      }

      getAllItems(): TestItem[] {
        return this.testRepository.getAll();
      }
    }

    const testController = new TestController();
    expect(testController.getAllItems()).toEqual([{ id: 1, name: "test" }]);
  });
});
