# Node.js 24 LTS on Alpine, native arm64. Pinned by digest at freeze time
# (harness/bin/pin-images style) before results are published.

# ---- build: install everything, generate the Prisma client, compile TypeScript
FROM node:24.22.1-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
# prisma.config.ts reads DATABASE_URL; generate doesn't connect, any value works.
RUN DATABASE_URL=postgres://build/none npm run build \
 && npm prune --omit=dev --no-audit --no-fund

# ---- runtime: production dependencies and compiled code only
FROM node:24.22.1-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080 9464
# node as PID 1 with its own SIGTERM handler (src/server.ts) for a graceful stop.
CMD ["node", "dist/main.js"]
