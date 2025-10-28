FROM node:24-alpine AS base
WORKDIR /api
# ENV CI=1

# アプリ本体
COPY package*.json ./
RUN npm ci
# COPY . .

EXPOSE 4000
CMD ["npm", "run", "dev"]