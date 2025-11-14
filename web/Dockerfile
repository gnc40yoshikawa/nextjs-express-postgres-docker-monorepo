FROM node:24-alpine AS base
WORKDIR /web

# 日本時間（Asia/Tokyo）に設定
RUN apk add --no-cache tzdata \
  && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
  && echo "Asia/Tokyo" > /etc/timezone

# アプリ本体
COPY package*.json ./
RUN npm ci
# COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]