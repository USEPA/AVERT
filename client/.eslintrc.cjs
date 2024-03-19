module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["build", "cypress.config.ts", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "no-extra-boolean-cast": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true }, // allow export const foo = 4
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_" }, // ignore unused args starting with _
    ],
  },
};
