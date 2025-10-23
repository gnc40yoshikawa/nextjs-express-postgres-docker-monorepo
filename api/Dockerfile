# apps/api/Dockerfile

FROM node:24-alpine AS base
WORKDIR /api
# ENV CI=1

# アプリ本体
COPY . .
RUN npm install

EXPOSE 4000
CMD ["node", "index.js"]