# apps/web/Dockerfile

FROM node:24-alpine AS base
WORKDIR /web
# ENV CI=1
# pnpm を使えるように（ホストにNodeがなくてもOK）
#RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# 依存解決
# COPY package.json ./
#RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm i --no-frozen-lockfile

# アプリ本体
COPY . .
RUN npm ci

EXPOSE 3000
#CMD ["pnpm", "dev", "-p", "3000"]
CMD ["npm", "run", "dev"]