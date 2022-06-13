module.exports = {
  collectCoverageFrom: ["src/**/*.ts"],
  coverageReporters: ["text", "html"],
  coverageDirectory: "<rootDir>/coverage",
  testEnvironment: "node",
  testMatch: ["**/?(*.)(test|spec).ts"],
  coveragePathIgnorePatterns: ["index.ts"],
  transform: { "^.+\\.(ts)?$": "ts-jest" },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
