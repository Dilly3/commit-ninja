# Build stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
	npm set cache /usr/src/app/.npm && \
	npm install

COPY . .

RUN npm run build

# Runtime stage
FROM node:18-alpine as runtime

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

USER node

EXPOSE 7020

HEALTHCHECK --interval=60s --timeout=60s --start-period=25s --retries=3 \
	CMD wget --quiet --tries=1 --spider http://localhost:7020 || exit 1

CMD [ "sh", "-c", "echo \"Starting in $NODE_ENV mode\" && if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi" ]