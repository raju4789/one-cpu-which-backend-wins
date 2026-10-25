# Node.js 24 LTS on Alpine, native arm64. Pinned by digest, like the harness
# images: every build uses the same bytes, and with the image already local,
# bin/up's rebuild before each run doesn't need Docker Hub.

# ---- build: install everything, generate the Prisma client, compile TypeScript
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS build
# Prisma's CLI detects the OpenSSL version to pick its engine binaries; Alpine doesn't ship it.
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
COPY test ./test
# prisma.config.ts reads DATABASE_URL; generate doesn't connect, any value works.
# Unit tests run here, so an image that fails them is never built.
RUN DATABASE_URL=postgres://build/none npm run build \
 && npm test \
 && npm prune --omit=dev --no-audit --no-fund \
 && chmod -R a+rX package.json dist node_modules
# chmod: COPY keeps the source files' permissions. Files that are private on
# the host (mode 600) would be unreadable to the "node" user at runtime.

# ---- runtime: production dependencies and compiled code only
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080 9464
# node as PID 1 with its own SIGTERM handler (src/server.ts) for a graceful stop.
CMD ["node", "dist/main.js"]
