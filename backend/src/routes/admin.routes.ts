import { Router } from 'express';
import { Role } from '@prisma/client';

import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { getDashboard } from '../controllers/admin.controller';

const router = Router();

router.get(
  '/',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN,
    Role.FINANCE_ADMIN
  ),
  getDashboard
);

export default router;