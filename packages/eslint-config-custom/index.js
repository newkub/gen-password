module.exports = {
  extends: ["eslint:recommended", "turbo"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  rules: {
    "react/jsx-key": "off",
  },
};
