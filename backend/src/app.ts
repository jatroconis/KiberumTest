import cors from 'cors';
import dotenv from 'dotenv';
import express, { type ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import { authRouter } from './routes/auth.js';
import { tasksRouter } from './routes/tasks.js';
import { prisma } from './utils/prisma.js';

dotenv.config();

export async function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
  app.use(morgan('dev'));

  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ ok: true });
    } catch {
      res.status(500).json({ ok: false, error: 'db_unreachable' });
    }
  });

  app.use('/auth', authRouter);
  app.use('/tasks', tasksRouter);

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    const status = (err as any).statusCode ?? 500;
    res.status(status).json({ error: (err as any).message ?? 'Internal Server Error' });
  };
  app.use(errorHandler);

  return app;
}
