module.exports = {
  roots: ["<rootDir>/src"],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "babel",

  // The test environment that will be used for testing
  testEnvironment: "node",

  // A map from regular expressions to paths to transformers
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
