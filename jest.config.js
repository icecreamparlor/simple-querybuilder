module.exports = {
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: "\\.test\\.ts$",
  globals: {
    "ts-jest": {
      diagnostics: true,
      isolatedModules: true,
    },
  },
};
