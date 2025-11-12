// eslint.config.mts
import { defineConfig, globalIgnores } from "eslint/config";
//import nextVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import type { Linter } from "eslint";

// 型情報を使う Type-Checked ルールを有効にする場合、
// ルートに tsconfig.eslint.json を置くのが安全です（extends で tsconfig.app を参照でもOK）。
const typeAware: Linter.FlatConfig = {
  languageOptions: {
    parserOptions: {
      // Type-Checked ルールに必要
      // (tseslint v7+: "projectService: true" で複数プロジェクトにも対応しやすい)
      projectService: true,
      tsconfigRootDir: process.cwd(),
      ecmaFeatures: { jsx: true },
      sourceType: "module",
    },
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
};

// 共通ルール（TS/JS共通）
const commonRules: Linter.RulesRecord = {
  ...reactHooks.configs.recommended.rules,
  ...jsxA11y.configs.recommended.rules,
  "react/react-in-jsx-scope": "off", // Next.js では不要
  "react/prop-types": "off", // TS なら不要
  // 使っていない変数は警告。引数は先頭_なら許容
  "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
};

export default defineConfig([
  // 1) Next.js の推奨（Core Web Vitals）
  //...nextVitals,

  // 2) TypeScript の推奨（非 type-checked）
  ...tseslint.configs.recommended,

  // 3) Type-Checked 版の推奨（型情報を使う厳しめルール）
  //    例: any の濫用や不安全な型変換をより強く検出
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    ...typeAware,
  })),

  // 4) プロジェクト共通の設定・ルール
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      // React バージョン警告の解消
      react: { version: "detect" },
    },
    rules: {
      ...commonRules,
      // Next.js の Link / 画像回りで誤検出が出る場合は個別に調整:
      // "@next/next/no-img-element": "off",
    },
  },

  // 5) 無視パターン（Next のビルド成果物など）
  globalIgnores([
    "./web/.next/**",
    "./web/out/**",
    "./web/build/**",
    "./web/next-env.d.ts",
    // 任意で追加:
    "./web/coverage/**",
    "./web/dist/**",
  ]),

  // 6) 設定ファイルやスクリプトはゆるめに（必要に応じて）
  {
    files: ["**/*.{cjs,mjs,js,ts}"],
    ignores: [
      "./web/node_modules/**",
    ],
  },

  // 7) テストコードは少し緩める例（Jest/Vitest等）
  {
    files: ["**/*.test.{ts,tsx,js,jsx}", "**/__tests__/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react/prop-types": "off",
    },
  },
]);
