FROM node:16-alpine

COPY . /app
WORKDIR /app

RUN yarn install
RUN npm pack && npm install -g blockfrost-*.tgz

ENTRYPOINT ["/usr/local/bin/bcc"]
