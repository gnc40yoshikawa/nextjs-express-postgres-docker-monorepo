import type { NextConfig } from "next";

type WebpackWatchOptions = {
  poll?: number;
  aggregateTimeout?: number;
};
type WebpackConfigLike = {
  watchOptions?: WebpackWatchOptions;
  // 必要なら他のプロパティも追加してOK
};

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config: WebpackConfigLike, { dev }): WebpackConfigLike => {
    if (dev) {
      config.watchOptions = {
        // イベント監視が不安定な環境向けにポーリングへ
        poll: 5000,            // 5秒ごとに差分チェック（要調整）
        aggregateTimeout: 2000, // 変更連打時に2000ms待ってまとめて再ビルド（要調整）
        // ignored: /node_modules/, // 必要なら監視除外（既定で除外）
      };
    }
    return config;
  },
};

export default nextConfig;
