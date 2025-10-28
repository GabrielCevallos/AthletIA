# Multi-stage build for NestJS app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
# Install curl so Docker healthchecks that use curl work inside the container.
RUN apk add --no-cache curl
EXPOSE 3000
#CMD ["node", "dist/main.js"]

RUN apk add --no-cache netcat-openbsd
COPY wait-for-rabbitmq.sh /usr/local/bin/wait-for-rabbitmq.sh
RUN chmod +x /usr/local/bin/wait-for-rabbitmq.sh

# Cambiar entrypoint para que espere RabbitMQ
ENTRYPOINT ["/usr/local/bin/wait-for-rabbitmq.sh"]
CMD ["node", "dist/main.js"]
