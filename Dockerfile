FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run tailwind:build

RUN npm install -g pm2

EXPOSE 3000

RUN mkdir -p /app/logs

CMD ["pm2-runtime", "start", "ecosystem.config.js"]