# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --prefer-offline --no-audit

COPY . .

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --chown=nodejs:nodejs healthcheck.js ./

USER nodejs

HEALTHCHECK --interval=15s --timeout=5s --retries=5 --start-period=30s \
    CMD ["node", "healthcheck.js"]

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

EXPOSE 3000
