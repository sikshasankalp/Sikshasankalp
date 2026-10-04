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
  createGallerySchema,
  updateGallerySchema,
  galleryIdSchema,
  galleryQuerySchema
} from '../validators/gallery.validator';

import {
  listGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery
} from '../controllers/gallery.controller';

import { AppError } from '../errors/AppError';

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
 * Must be declared before /:id so "admin" is not interpreted
 * as a gallery item ID.
 */
router.get(
  '/admin',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateQuery(galleryQuerySchema),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listGallery
);

/**
 * Public GET
 */
router.get(
  '/',
  validateQuery(galleryQuerySchema),
  listGallery
);

router.get(
  '/:id',
  validateParams(galleryIdSchema),
  getGalleryById
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
  validateBody(createGallerySchema),
  createGallery
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(galleryIdSchema),
  uploadImageMiddleware.single('image'),
  validateBody(updateGallerySchema),
  updateGallery
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(galleryIdSchema),
  deleteGallery
);

export default router;