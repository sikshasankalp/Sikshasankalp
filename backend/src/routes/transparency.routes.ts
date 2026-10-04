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
  createTransparencySchema,
  updateTransparencySchema,
  transparencyIdSchema,
  transparencyQuerySchema
} from '../validators/transparency.validator';

import { AppError } from '../errors/AppError';

import {
  listTransparency,
  getTransparencyById,
  createTransparency,
  updateTransparency,
  deleteTransparency
} from '../controllers/transparency.controller';

const router = Router();

const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(new AppError('Invalid query parameters', 400));
      return;
    }

    Object.assign(req.query, result.data);
    next();
  };

const validateParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(new AppError('Invalid request parameters', 400));
      return;
    }

    Object.assign(req.params, result.data);
    next();
  };

/**
 * Admin GET
 */
router.get(
  '/admin',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateQuery(transparencyQuerySchema),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listTransparency
);

/**
 * Public GET
 */
router.get(
  '/',
  validateQuery(transparencyQuerySchema),
  listTransparency
);

router.get(
  '/:id',
  validateParams(transparencyIdSchema),
  getTransparencyById
);

/**
 * Admin WRITE
 */
router.post(
  '/',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateBody(createTransparencySchema),
  createTransparency
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(transparencyIdSchema),
  validateBody(updateTransparencySchema),
  updateTransparency
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(transparencyIdSchema),
  deleteTransparency
);

export default router;