import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getDashboard } from '../controllers/admin.controller';

const router = Router();

router.get('/', requireAuth, getDashboard);

export default router;
