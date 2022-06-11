import { MetadataKeys } from "../utils/metadata.keys";
import { ControllerMiddleware } from "./controller.middleware";

describe("@ControllerMiddleware", () => {
  it("should add middleware info in metadata to class", () => {
    const middlewareFunction1 = () => "middleware1";
    const middlewareFunction2 = () => "middleware2";

    @ControllerMiddleware(middlewareFunction1)
    @ControllerMiddleware(middlewareFunction2)
    class TestController {}

    const middleware = Reflect.getMetadata(
      MetadataKeys.MIDDLEWARE,
      TestController
    );
    expect(middleware).toBeDefined();
    expect(middleware.length).toBe(2);
    expect(middleware[0]()).toBe("middleware2");
    expect(middleware[1]()).toBe("middleware1");
  });
});
