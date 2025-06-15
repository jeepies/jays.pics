export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
