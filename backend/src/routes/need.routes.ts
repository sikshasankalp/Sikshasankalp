import { Router } from 'express';
import { Role } from '@prisma/client';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  createNeedSchema,
  updateNeedSchema,
  needIdSchema,
  needQuerySchema
} from '../validators/need.validator';
import {
  listNeeds,
  getNeedById,
  createNeed,
  updateNeed,
  deleteNeed
} from '../controllers/need.controller';

const router = Router();

// Public: GET all active needs (used by marquee ticker & /needs page)
router.get('/', listNeeds);

// Admin: GET all needs (including inactive ones)
router.get(
  '/admin',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listNeeds
);

router.get('/:id', getNeedById);

// Admin WRITE
router.post(
  '/',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  validateBody(createNeedSchema),
  createNeed
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  validateBody(updateNeedSchema),
  updateNeed
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  deleteNeed
);

export default router;
