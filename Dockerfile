FROM node:22.22.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "--no-warnings", "--experimental-transform-types", "app.ts"]
