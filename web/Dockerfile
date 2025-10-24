FROM node:24-alpine AS base
WORKDIR /web

# アプリ本体
COPY . .
RUN npm ci

EXPOSE 3000
CMD ["npm", "run", "dev"]