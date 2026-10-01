import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import healthRoutes from './health.routes';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authLimiter, authRoutes);
router.use('/admin/dashboard', adminRoutes);

export default router;
