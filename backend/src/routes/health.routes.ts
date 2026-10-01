import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Quick DB check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, message: 'API is running' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'API is running, but database connection failed' });
  }
});

export default router;
