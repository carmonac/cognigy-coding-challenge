module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config", "reflect-metadata"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
