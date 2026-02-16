/**
 * @see https://susisu.hatenablog.com/entry/2025/03/30/153957
 * @see https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/
 */
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
  },

  // JavaScript Config
  {
    files: ["**/*.{js,cjs,mjs}"],
    extends: [js.configs.recommended],
  },

  // TypeScript Config
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },

  // React Config
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    settings: {
      react: { version: "detect" },
    },
    extends: [
      react.configs.flat.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },

  prettier,
]);
