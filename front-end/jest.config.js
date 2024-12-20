module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "esbuild-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
};
