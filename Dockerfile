
FROM node:18-alpine

WORKDIR /usr/src/app


COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm 
  
RUN npm install nodemon
  
RUN if [ "$NODE_ENV" != "production" ]; then npm install; else npm install --only=production; fi

USER node

COPY --chown=node:node ./src .

EXPOSE 7020

HEALTHCHECK --interval=60s --timeout=60s --start-period=5s --retries=3 \
	CMD wget --quiet --tries=1 --spider http://localhost:7020 || exit 1

CMD [ "sh", "-c", "echo \"Starting in $NODE_ENV mode\" && if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi" ]