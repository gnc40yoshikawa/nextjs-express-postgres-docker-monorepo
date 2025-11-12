/// <reference lib="es2022" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "eslint/config";

export default (async () => {
  const [
    tseslint,
    react,
    reactHooks,
    jsxA11y,
    nextPlugin,
    globalsMod,
  ] = await Promise.all([
    import("typescript-eslint"),
    import("eslint-plugin-react"),
    import("eslint-plugin-react-hooks"),
    import("eslint-plugin-jsx-a11y"),
    import("@next/eslint-plugin-next"),
    import("globals"),
  ]);

  const globals = (globalsMod as any).default ?? globalsMod;
  const cwd = process.cwd();

  // 1) tseslint の type-aware プリセットから「rules だけ」抽出
  const tsStrictArr = ((tseslint as any).configs.strictTypeChecked ?? []) as any[];
  const tsStyleArr  = ((tseslint as any).configs.stylisticTypeChecked ?? []) as any[];
  const strictRules = Object.assign({}, ...tsStrictArr.map((c) => c.rules ?? {}));
  const styleRules  = Object.assign({}, ...tsStyleArr.map((c) => c.rules ?? {}));

  // ベース（型不要の推奨）
  const base = defineConfig([
    ...(((tseslint as any).configs.recommended ?? []) as any[]),
    {
      name: "root-ignores",
      ignores: [
        "**/node_modules/**",
        "**/.next/**",
        "**/.turbo/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/.prisma/**",
        "**/prisma/migrations/**",
        "**/docker/**",
        "**/db/**",
      ],
    },
    {
      name: "base-overrides",
      files: ["**/*.{ts,tsx,js,jsx,mts,mjs,cjs}"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: { ...globals.node, ...globals.browser },
        parserOptions: { tsconfigRootDir: cwd },
      },
      plugins: {
        react: (react as any).default ?? (react as any),
        "react-hooks": (reactHooks as any).default ?? (reactHooks as any),
        "jsx-a11y": (jsxA11y as any).default ?? (jsxA11y as any),
      },
      settings: { react: { version: "detect" } },
      rules: {
        "react/jsx-boolean-value": ["warn", "never"],
        "react/self-closing-comp": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "jsx-a11y/alt-text": "warn",
        "jsx-a11y/anchor-is-valid": "warn",
        "jsx-a11y/no-autofocus": "off",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        // ここでは type-aware ルールは入れない！
      },
    },
  ]);

  // web: Next.js
  const web = defineConfig([
    {
      name: "web-next",
      files: ["web/**/*.{ts,tsx,js,jsx}"],
      plugins: {
        "@next/next": (nextPlugin as any).default ?? (nextPlugin as any),
      },
      rules: {
        "@next/next/no-img-element": "warn",
        "@next/next/no-sync-scripts": "warn",
        "@next/next/no-html-link-for-pages": "off",
        "@next/next/no-document-import-in-page": "off",
        "@next/next/google-font-display": "warn",
        "@next/next/google-font-preconnect": "warn",
      },
    },
    {
      // ★ 型情報が必要なルールは TS のみ & project 指定
      name: "web-type-aware",
      files: ["web/**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          projectService: false,
          project: ["./web/tsconfig.json"],
          tsconfigRootDir: cwd,
        },
      },
      rules: {
        ...strictRules,
        ...styleRules,
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-misused-promises": [
          "warn",
          { checksVoidReturn: { attributes: false } },
        ],
      },
    },
  ]);

  // api: Express
  const api = defineConfig([
    {
      name: "api-node",
      files: ["api/**/*.{ts,tsx,js,jsx}"],
      languageOptions: { globals: { ...globals.node } },
      rules: {
        "no-process-exit": "off",
        "no-restricted-syntax": [
          "warn",
          { selector: "CallExpression[callee.name='eval']", message: "Avoid eval()." },
        ],
      },
    },
    {
      // ★ 同様に TS のみ & project 指定
      name: "api-type-aware",
      files: ["api/**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          projectService: false,
          project: ["./api/tsconfig.json"],
          tsconfigRootDir: cwd,
        },
      },
      rules: {
        ...strictRules,
        ...styleRules,
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/require-await": "off",
      },
    },
  ]);

  return defineConfig([...base, ...web, ...api]);
})();
