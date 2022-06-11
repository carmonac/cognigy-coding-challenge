import { Get, Post, Put, Delete, Patch } from "./method";
import Controller from "./controller";
import { MetadataKeys, RouterData } from "../utils/metadata.keys";

describe("@Method", () => {
  it("should add route info in metadata to methods", () => {
    @Controller("/")
    class TestController {
      @Get("/test")
      testGet() {}

      @Post("/test")
      testPost() {}

      @Put("/test")
      testPut() {}

      @Delete("/test")
      testDelete() {}

      @Patch("/test")
      testPatch() {}
    }

    const routePath: string = Reflect.getMetadata(
      MetadataKeys.ROUTE_PATH,
      TestController
    );

    expect(routePath).toBeDefined();
    expect(routePath).toBe("/");

    const routers: RouterData[] = Reflect.hasMetadata(
      MetadataKeys.ROUTERS,
      TestController
    )
      ? Reflect.getMetadata(MetadataKeys.ROUTERS, TestController)
      : [];

    expect(routers).toBeDefined();
    expect(routers.length).toBe(5);

    expect(routers[0].method).toBe("get");
    expect(routers[0].path).toBe("/test");
    expect(routers[0].handlerName).toBe("testGet");

    expect(routers[1].method).toBe("post");
    expect(routers[1].path).toBe("/test");
    expect(routers[1].handlerName).toBe("testPost");

    expect(routers[2].method).toBe("put");
    expect(routers[2].path).toBe("/test");
    expect(routers[2].handlerName).toBe("testPut");

    expect(routers[3].method).toBe("delete");
    expect(routers[3].path).toBe("/test");
    expect(routers[3].handlerName).toBe("testDelete");

    expect(routers[4].method).toBe("patch");
    expect(routers[4].path).toBe("/test");
    expect(routers[4].handlerName).toBe("testPatch");
  });
});
