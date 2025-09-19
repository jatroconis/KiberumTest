# syntax=docker/dockerfile:1.7

# ---- Base con pnpm via Corepack ----
FROM node:22-alpine AS base
WORKDIR /usr/src/app
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Deps: instala node_modules con schema presente para que postinstall (prisma generate) funcione ----
FROM base AS deps
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN pnpm install --frozen-lockfile || pnpm install

# ---- Dev: hot reload con pnpm y tsx ----
FROM base AS dev
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3000
# Nota: el comando lo sobrescribe docker-compose (pnpm prisma:generate && ... && pnpm dev)

# ---- Builder: compila a dist (tsc) ----
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm prisma:generate
RUN pnpm build

# ---- Prod: imagen mínima para correr dist/ con Node ----
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node","dist/server.js"]
