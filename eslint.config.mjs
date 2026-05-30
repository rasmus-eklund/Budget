import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import drizzlePlugin from "eslint-plugin-drizzle";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  // Next.js core-web-vitals
  ...nextVitals,

  // Override default ignores
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // TypeScript + custom plugin rules
  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json", // <--- required for type-aware rules
        tsconfigRootDir: process.cwd(),
      },
    },

    plugins: {
      drizzle: drizzlePlugin,
      "unused-imports": unusedImportsPlugin,
    },

    rules: {
      // TypeScript rules
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      // Drizzle plugin rules
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",

      // unused-imports rules
      "unused-imports/no-unused-imports": "error",

      // General correctness
      eqeqeq: ["error", "smart"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      curly: ["error", "all"],
    },
  },
]);
