module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // Allow double quotes (consistent with your formatting)
    quotes: ["error", "double"],
    // Allow semicolons
    semi: ["error", "always"],
    // Allow trailing commas
    "comma-dangle": ["error", "always-multiline"],
    // Allow unused vars that start with underscore
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    // Allow any type in specific cases
    "@typescript-eslint/no-explicit-any": "warn",
    // Allow non-null assertion
    "@typescript-eslint/no-non-null-assertion": "warn",
    // Allow empty interfaces
    "@typescript-eslint/no-empty-interface": "off",
    // Allow require statements
    "@typescript-eslint/no-var-requires": "off",
  },
  ignorePatterns: ["node_modules/", "dist/", "build/", "*.js", "*.d.ts"],
};
