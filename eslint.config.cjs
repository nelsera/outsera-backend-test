const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const simpleImportSort = require("eslint-plugin-simple-import-sort");

module.exports = [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "eslint.config.cjs",
      ".lintstagedrc.cjs",
      "commitlint.config.cjs"
    ]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      "simple-import-sort": simpleImportSort
    },

    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  },

  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  }
];
