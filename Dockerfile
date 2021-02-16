### --- Begin of Base ---
FROM node:10.15.3-alpine as base
ENV NODE_ENV=development \
    APP_ENV=development \
    YARN_REGISTRY=https://npm.ddoperation.com:9000 \
    TZ="Asia/Bangkok"

ARG YARN_USER=""
ARG YARN_PASSWORD=""

WORKDIR /app
RUN apk --no-cache add tzdata jq curl

COPY . /app/

RUN export TOKEN=$(curl -s -H "Accept: application/json" \
	-H "Content-Type:application/json" \
	-X PUT --data '{"name":  "'"$YARN_USER"'", "password": "'"$YARN_PASSWORD"'", "type": "user"}' \
	--user $YARN_USER:$YARN_PASSWORD \
	$YARN_REGISTRY/-/user/org.couchdb.user:$YARN_USER 2>&1 | jq -r '.token') \
    && echo "//npm.ddoperation.com:9000/:_authToken=$TOKEN" > /root/.npmrc \
    && npm config set always-auth true \
    && yarn config set registry $YARN_REGISTRY \
    && sed -i 's,https://registry.yarnpkg.com,https://npm.ddoperation.com:9000,g' yarn.lock \
    && yarn install --ignore-engines \
    && yarn build \
    && yarn cache clean

### --- End of Base ---

FROM node:10.15.3-alpine

ENV NODE_ENV=production \
    APP_ENV=production \
    YARN_REGISTRY=https://npm.ddoperation.com:9000 \
    TZ="Asia/Bangkok"

WORKDIR /app

RUN apk add --no-cache tini tzdata curl

COPY package.json yarn.loc* /app/
COPY --from=base /root/.npmrc /root/.npmrc
COPY --from=base /app/dist /app/dist

RUN npm config set always-auth true \
    && yarn config set registry $YARN_REGISTRY \
    && sed -i 's,https://registry.yarnpkg.com,https://npm.ddoperation.com:9000,g' yarn.lock \
    && yarn install --production --ignore-engines \
    && yarn cache clean

EXPOSE 9000 9001
CMD ["tini", "--", "node", "build/server.js"]