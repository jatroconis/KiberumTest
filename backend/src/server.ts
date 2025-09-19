import { createServer } from './app.js';

const port = Number(process.env.PORT) || 3000;

const start = async () => {
  const app = await createServer();
  app.listen(port, () => {
    console.log(`[api] listening on http://0.0.0.0:${port}`);
  });
};

start().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});
