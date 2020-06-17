### --- Begin of Base ---
FROM node:10.15.3-alpine as base
ENV NODE_ENV=development \
    APP_ENV=development
WORKDIR /app
COPY package.json ts*.json yarn.loc* /app/
RUN yarn install
COPY . /app
RUN yarn build \
    && yarn cache clean

### --- End of Base ---

FROM node:10.15.3-alpine
ENV NODE_ENV=production \
    APP_ENV=production \
    TZ=Asia/Bangkok
RUN apk add --no-cache tini tzdata

WORKDIR /app
COPY package.json /app
COPY --from=base /app/build /app/build
RUN yarn install --production \
    && yarn cache clean \
    && rm -rf /var/lib/apt/lists/*
EXPOSE 9000 9001
CMD ["tini", "--", "node", "build/server.js"]