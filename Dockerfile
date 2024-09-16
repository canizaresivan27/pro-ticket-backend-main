FROM node:18-alpine as deps
WORKDIR /app

COPY package.json ./
RUN npm install --frozen-lockfile

FROM node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /app
ENV PORT=9000

COPY package.json ./
RUN npm install --prod
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/app.js"]