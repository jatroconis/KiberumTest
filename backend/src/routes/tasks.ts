import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth.js';
import { prisma } from '../utils/prisma.js';

export const tasksRouter = Router();
tasksRouter.use(requireAuth);
// aqui todos mos metodos crudd
const TaskStatus = z.enum(['pending','completed']);
const createSchema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().default('').optional(),
  status: TaskStatus.default('pending').optional()
});
const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: TaskStatus.optional()
}).refine(d => Object.keys(d).length > 0, { message: 'no fields to update' });

// GET /tasks?status=pending|completed
tasksRouter.get('/', async (req, res) => {
  const status = req.query.status as 'pending' | 'completed' | undefined;
  const where = status ? { status } : {};
  const list = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  res.json(list);
});

// POST /tasks
tasksRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const task = await prisma.task.create({ data: parsed.data });
  res.status(201).json(task);
});

// PUT /tasks/:id
tasksRouter.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const task = await prisma.task.update({ where: { id }, data: parsed.data });
    res.json(task);
  } catch (e) {
    return res.status(404).json({ error: 'task_not_found' });
  }
});

// DELETE /tasks/:id
tasksRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'task_not_found' });
  }
});
