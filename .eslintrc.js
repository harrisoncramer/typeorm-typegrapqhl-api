module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ["plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    "@typescript-eslint/ban-types": ["warn"],
    "@typescript-eslint/no-non-null-assertion": ["off"],
    "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-inferrable-types": ["off"],
  },
};
