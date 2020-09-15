FROM node:12-alpine3.12

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY csv-sources ./csv-sources

RUN yarn install
RUN mkdir -p ./db
RUN node csv-sources/recreate.js

COPY index.js ./index.js 

ENTRYPOINT [ "/usr/local/bin/node", "/app/index.js", "localTesting" ]