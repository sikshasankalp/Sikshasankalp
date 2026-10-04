import { Router, Request, Response } from 'express';

import { prisma } from '../config/database';

const router = Router();

router.get(
  '/',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        success: true,
        message: 'API is running',
        database: 'connected'
      });
    } catch {
      res.status(503).json({
        success: false,
        message: 'API is running, but database connection failed',
        database: 'unavailable'
      });
    }
  }
);

export default router;