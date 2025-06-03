# backend/Dockerfile
FROM node:18

# install pnpm as Docker does not have it by default
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install

COPY . .
RUN npm run build

EXPOSE 8000

CMD [ "npm", "run", "start" ]






