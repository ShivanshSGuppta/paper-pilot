FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/worker ./apps/worker

RUN pnpm install --no-frozen-lockfile

WORKDIR /app/apps/worker
CMD ["pnpm", "exec", "tsx", "src/worker.ts"]
