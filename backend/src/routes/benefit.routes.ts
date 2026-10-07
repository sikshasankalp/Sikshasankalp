import { Router } from 'express';
import { Role } from '@prisma/client';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  createBenefitSchema,
  updateBenefitSchema,
} from '../validators/benefit.validator';
import {
  listBenefits,
  getBenefitById,
  createBenefit,
  updateBenefit,
  deleteBenefit,
  seedBenefits,
} from '../controllers/benefit.controller';

const router = Router();

// Public: GET active benefits
router.get('/', listBenefits);

// Admin: GET all benefits
router.get(
  '/admin',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listBenefits
);

router.get('/:id', getBenefitById);

// Admin WRITE
router.post(
  '/',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  validateBody(createBenefitSchema),
  createBenefit
);

router.post(
  '/seed',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  seedBenefits
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  validateBody(updateBenefitSchema),
  updateBenefit
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(Role.SUPER_ADMIN, Role.CONTENT_ADMIN),
  deleteBenefit
);

export default router;
