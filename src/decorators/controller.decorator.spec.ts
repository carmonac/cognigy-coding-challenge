import Controller from "./controller.decorator";
import { MetadataKeys } from "../utils/metadata.keys";

describe("@Controller", () => {
  it("should add route info in metadata", () => {
    @Controller("/test")
    class TestController {}

    const routePath: string = Reflect.getMetadata(
      MetadataKeys.ROUTE_PATH,
      TestController
    );

    expect(routePath).toBeDefined();
    expect(routePath).toBe("/test");
  });
});
