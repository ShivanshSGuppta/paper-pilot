FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init ca-certificates chromium python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --no-frozen-lockfile

WORKDIR /app/apps/api
EXPOSE 4000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["pnpm", "exec", "tsx", "src/server.ts"]
