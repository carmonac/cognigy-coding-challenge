import apicache from "apicache";
import config from "../config";

export const cache = apicache.options({
  enabled: config.cache === "true",
  headers: {
    "Cache-Control": "no-cache",
  },
  statusCodes: {
    include: [200, 201, 204, 301, 302, 304],
  },
}).middleware;
