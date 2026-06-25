import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    ignores: [".next/**", "node_modules/**", "out/**", "src/generated/**", "next-env.d.ts"],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-var": "error",
      "no-console": "warn",
    },
  },
]);
