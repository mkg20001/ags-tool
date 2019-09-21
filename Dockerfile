FROM node:10-alpine

WORKDIR /app
COPY . /app
RUN npm i && npm run build && rm -rf node_modules && npm i --prod

ENTRYPOINT ["/app/bin.js"]
CMD ["/config.yaml"]
