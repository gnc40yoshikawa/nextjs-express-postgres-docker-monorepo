# nextjs-express-postgres-docker-monorepo

## 使用技術一覧
<p style="display: inline">
  <!-- フロントエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-TailwindCSS-000000.svg?logo=tailwindcss&style=for-the-badge">
  <img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <!-- バックエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-Express-181818.svg?logo=express&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Prisma-000000.svg?logo=prisma&style=for-the-badge">
  <!-- バックエンドの言語一覧 -->
  <img src="https://img.shields.io/badge/-TypeSript-3178c6.svg?logo=typescript&style=for-the-badge&logoColor=ffffff">
  <!-- ミドルウェア一覧 -->
  <img src="https://img.shields.io/badge/-PostgreSQL-4169E1.svg?logo=postgresql&style=for-the-badge&logoColor=ffffff">
  <!-- インフラ一覧 -->
  <img src="https://img.shields.io/badge/-Docker-2496ED.svg?logo=docker&style=for-the-badge&logoColor=ffffff">
</p>

## 目次
1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築](#開発環境構築)
5. [トラブルシューティング](#トラブルシューティング)

## プロジェクト名
Docker上にNext.jsとExpressjsとPostgreSQLを構築する開発テンプレートです。

## プロジェクトについて
Docker上にNext.jsとExpressjsとPostgreSQLを構築する開発テンプレートです。

## 環境
| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| TypeScript            | 5.9.3      |
| Express               | 5.1.0      |
| Prisma                | 6.19.0     |
| PostgreSQL            | 18.0       |
| Node.js               | 24.11.0    |
| React                 | 19.2.0     |
| Next.js               | 16.0.0     |
| TailwindCSS           | 4.1.16     |

その他のパッケージのバージョンは Dockerfile と package.json を参照してください

## ディレクトリ構成

## 開発環境構築

### コンテナの作成と起動
初回起動時：docker compose up -d --build<br>
2回目以降：docker compose up -d

### 動作確認
http://web.localhost にアクセスできるか確認<br>
アクセスできたら成功

### コンテナの停止
以下のコマンドでコンテナを停止することができます<br>
docker compose down

### 環境変数の一覧
| 変数名                 | 役割                                      | デフォルト値                       | DEV 環境での値                           |
| ---------------------- | ----------------------------------------- | ---------------------------------- | ---------------------------------------- |

### コマンド一覧
|コマンド                | 実行する処理    |
| ------------------- | -------------------------- |
| docker compose up -d --build | node_modules のインストール、イメージのビルド、コンテナの起動を順に行う |
|docker compose up -d|コンテナの起動|
|docker compose down|コンテナの停止|
|docker exec -it nextjs-express-postgres-docker-monorepo-web-1 sh |Webのコンテナへ入る|
|docker exec -it nextjs-express-postgres-docker-monorepo-api-1 sh | APIのコンテナへ入る|
|docker exec -it nextjs-express-postgres-docker-monorepo-db-1 sh |データベースのコンテナへ入る|

### リモートデバッグの方法

## トラブルシューティング