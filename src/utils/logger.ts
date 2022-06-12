import log4js from "log4js";
import config from "../config";

export default (desc: string) => {
  const logger =log4js.getLogger(desc);
  logger.level = config.logLevel;
  return logger;
};
