#--------------------------------------------------------------------------------------------
FROM  node:18-bullseye-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install

#--------------------------------------------------------------------------------------------
FROM node:18-bullseye-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./
RUN npm run build

#--------------------------------------------------------------------------------------------
FROM node:18-bullseye-slim AS runner  
WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    fonts-liberation \
    libappindicator1 \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable


COPY package*.json ./
RUN npm install --prod
COPY --from=builder /app/dist ./dist

#envs

EXPOSE 3000
CMD ["node", "--max-old-space-size=2048", "dist/app.js"]