import {
  Router,
  Request,
  Response,
  NextFunction
} from 'express';
import { Role } from '@prisma/client';
import { ZodSchema } from 'zod';

import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';

import {
  createImpactMetricSchema,
  updateImpactMetricSchema,
  impactMetricIdSchema
} from '../validators/impact.validator';

import { AppError } from '../errors/AppError';

import {
  listImpactMetrics,
  getImpactMetricById,
  createImpactMetric,
  updateImpactMetric,
  deleteImpactMetric
} from '../controllers/impact.controller';

const router = Router();

const validateParams =
  (schema: ZodSchema) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(new AppError('Invalid request parameters', 400));
      return;
    }

    Object.assign(req.params, result.data);
    next();
  };

/**
 * Public endpoints
 */

router.get('/', listImpactMetrics);

/**
 * Admin endpoints
 */

router.get(
  '/admin/all',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listImpactMetrics
);

/**
 * Public single-item endpoint
 */

router.get(
  '/:id',
  validateParams(impactMetricIdSchema),
  getImpactMetricById
);

/**
 * Admin write endpoints
 */

router.post(
  '/',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateBody(createImpactMetricSchema),
  createImpactMetric
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(impactMetricIdSchema),
  validateBody(updateImpactMetricSchema),
  updateImpactMetric
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(impactMetricIdSchema),
  deleteImpactMetric
);

export default router;