// jest.config.ts
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./", // root of your Next.js app
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Handle CSS imports
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // Handle alias paths (adjust if you use paths in tsconfig)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
};

export default createJestConfig(customJestConfig);
