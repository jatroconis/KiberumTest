# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /usr/src/app
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

FROM base AS dev
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["pnpm","dev","--host","0.0.0.0"]

FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM nginx:alpine AS prod
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
