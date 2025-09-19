import { Router } from 'express';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { z } from 'zod';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

authRouter.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email } = parsed.data;
  const payload = { sub: email };

  const secret: Secret = process.env.JWT_SECRET ?? 'dev_secret';
  const expiresIn: SignOptions['expiresIn'] =
    (process.env.JWT_EXPIRES_IN ?? '1d') as SignOptions['expiresIn'];

  const token = jwt.sign(payload, secret, { expiresIn });
  res.json({ token, user: { email } });
});
