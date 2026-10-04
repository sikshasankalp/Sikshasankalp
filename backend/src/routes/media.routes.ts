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
import { uploadImageMiddleware } from '../middleware/upload.middleware';

import {
  createMediaSchema,
  updateMediaSchema,
  mediaIdSchema,
  mediaQuerySchema
} from '../validators/media.validator';

import { AppError } from '../errors/AppError';

import {
  listMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia
} from '../controllers/media.controller';

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
 *
 * Must be declared before /:id so "admin" is not
 * interpreted as a media ID.
 */
router.get(
  '/admin',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateQuery(mediaQuerySchema),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listMedia
);

/**
 * Public GET
 */
router.get(
  '/',
  validateQuery(mediaQuerySchema),
  listMedia
);

router.get(
  '/:id',
  validateParams(mediaIdSchema),
  getMediaById
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
  uploadImageMiddleware.single('image'),
  validateBody(createMediaSchema),
  createMedia
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(mediaIdSchema),
  uploadImageMiddleware.single('image'),
  validateBody(updateMediaSchema),
  updateMedia
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(mediaIdSchema),
  deleteMedia
);

export default router;