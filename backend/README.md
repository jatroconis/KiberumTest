## Requisitos

- Node 22+
- PNPM (Corepack)
- PostgreSQL (o usar Docker Compose del monorepo)

## Comandos

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate   # crea o actualiza tablas
pnpm dev              # modo desarrollo
pnpm seed             # datos demo
```

## Endpoints

- `GET /health`
- `POST /auth/login` -> { token }
- `GET /tasks?status=pending|completed`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
