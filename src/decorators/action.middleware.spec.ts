import { ActionMiddleware } from "./action.middleware";
import { Get } from "./method";
import Controller from "./controller";
import { MetadataKeys } from "../utils/metadata.keys";

describe("@ActionMiddleware", () => {
  it("should add middleware info in metadata to method", () => {
    const middlewareFunction1 = () => "middleware1";
    const middlewareFunction2 = () => "middleware2";

    @Controller("/")
    class TestController {
      @Get("/test")
      @ActionMiddleware(middlewareFunction1)
      @ActionMiddleware(middlewareFunction2)
      testGet() {}
    }
    const testController = new TestController();
    const middleware = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, testController, "testGet");
    expect(middleware).toBeDefined();
    expect(middleware.length).toBe(2);
    expect(middleware[0]()).toBe("middleware2");
    expect(middleware[1]()).toBe("middleware1");

  });
});