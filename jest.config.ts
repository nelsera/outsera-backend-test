import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  clearMocks: true,
  moduleNameMapper: {
    "^#database/(.*)$": "<rootDir>/src/database/$1",
    "^#repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^#services/(.*)$": "<rootDir>/src/services/$1",
    "^#types/(.*)$": "<rootDir>/src/types/$1",
    "^#utils/(.*)$": "<rootDir>/src/utils/$1",
  },
};

export default config;
