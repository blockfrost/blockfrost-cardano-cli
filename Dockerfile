FROM node:16-alpine

WORKDIR /app

RUN npm install -g @blockfrost/blockfrost-cardano-cli

ENTRYPOINT ["/usr/local/bin/bcc"]
