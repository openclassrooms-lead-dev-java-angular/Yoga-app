module.exports = {
  preset: "jest-preset-angular",

  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@core/(.*)$": "<rootDir>/src/app/core/$1",
    "^@shared/(.*)$": "<rootDir>/src/app/shared/$1",
    "^@pages/(.*)$": "<rootDir>/src/app/pages/$1",
    "^@service/(.*)$": "<rootDir>/src/app/core/service/$1",
    "^@models/(.*)$": "<rootDir>/src/app/core/models/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],

  bail: false,
  verbose: false,
  collectCoverage: false,

  coverageDirectory: "./coverage/jest",

  testPathIgnorePatterns: ["<rootDir>/node_modules/"],

  coveragePathIgnorePatterns: ["<rootDir>/node_modules/"],

  coverageThreshold: {
    global: {
      statements: 80,
    },
  },

  roots: ["<rootDir>"],

  modulePaths: ["<rootDir>"],

  moduleDirectories: ["node_modules"],
};
