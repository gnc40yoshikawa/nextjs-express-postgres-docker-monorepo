FROM node:24-alpine AS base
WORKDIR /web

# アプリ本体
COPY package*.json ./
RUN npm install
# COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]