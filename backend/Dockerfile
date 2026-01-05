FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY backend ./backend

WORKDIR /app/backend
EXPOSE 3001

CMD ["../node_modules/.bin/tsx", "server.ts"]
