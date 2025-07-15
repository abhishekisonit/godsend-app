import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      prettier, // Register the Prettier plugin for Flat config
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // General rules
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "build/**", "dist/**"],
  },
];

export default eslintConfig;
