### --- Begin of Base ---
FROM node:10.15.3-slim as base
ENV NODE_ENV=development \
    APP_ENV=development
WORKDIR /app
COPY . /app
RUN apt-get update && apt-get install -y curl \
    && yarn install \
    && yarn cache clean \
    && yarn build \
    && rm -rf /var/lib/apt/lists/*

### --- End of Base ---

FROM node:10.15.3-slim
ENV NODE_ENV=production \
    APP_ENV=production
WORKDIR /app
COPY package.json /app
COPY --from=base /app/build /app/build
RUN apt-get update && apt-get install -y curl \
    && yarn install --production \
    && yarn cache clean \
    && rm -rf /var/lib/apt/lists/*
CMD ["node", "build/server.js"]
