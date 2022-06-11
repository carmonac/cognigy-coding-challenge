import { Middleware } from "./middleware";
import { Get } from "./method";
import Controller from "./controller";
import { MetadataKeys } from "../utils/metadata.keys";

describe("@Middleware", () => {
  it("should add middleware info in metadata to method", () => {
    const middlewareFunction1 = () => "middleware1";
    const middlewareFunction2 = () => "middleware2";

    @Controller("/")
    class TestController {
      @Get("/test")
      @Middleware(middlewareFunction1)
      @Middleware(middlewareFunction2)
      testGet() {}
    }
    const testController = new TestController();
    const middleware = Reflect.getMetadata(
      MetadataKeys.MIDDLEWARE,
      testController,
      "testGet"
    );
    expect(middleware).toBeDefined();
    expect(middleware.length).toBe(2);
    expect(middleware[0]()).toBe("middleware2");
    expect(middleware[1]()).toBe("middleware1");
  });

  it("should add middleware info in metadata to class", () => {
    const middlewareFunction1 = () => "middleware1";
    const middlewareFunction2 = () => "middleware2";

    @Middleware(middlewareFunction1)
    @Middleware(middlewareFunction2)
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
