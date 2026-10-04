import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { Role } from '@prisma/client';
import { ZodSchema } from 'zod';

import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { uploadImageMiddleware } from '../middleware/upload.middleware';

import {
  createLibrarySchema,
  updateLibrarySchema,
  libraryIdSchema,
  libraryQuerySchema,
} from '../validators/library.validator';

import { AppError } from '../errors/AppError';

import {
  listLibraryResources,
  getLibraryResourceById,
  createLibraryResource,
  updateLibraryResource,
  deleteLibraryResource,
} from '../controllers/library.controller';

const router = Router();

const validateQuery =
  (schema: ZodSchema) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(
        new AppError(
          'Invalid query parameters',
          400,
        ),
      );
      return;
    }

    req.query = result.data as Request['query'];
    next();
  };

const validateParams =
  (schema: ZodSchema) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(
        new AppError(
          'Invalid request parameters',
          400,
        ),
      );
      return;
    }

    req.params = result.data as Request['params'];
    next();
  };

/*
 * ADMIN LIST
 *
 * Must stay before /:id.
 */
router.get(
  '/admin',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN,
  ),
  validateQuery(libraryQuerySchema),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listLibraryResources,
);

/*
 * PUBLIC LIST
 */
router.get(
  '/',
  validateQuery(libraryQuerySchema),
  listLibraryResources,
);

/*
 * GET SINGLE RESOURCE
 *
 * Public resources are returned publicly.
 * Admin users can also access unpublished resources
 * because the controller checks res.locals.isAdmin.
 */
router.get(
  '/:id',
  validateParams(libraryIdSchema),
  getLibraryResourceById,
);

/*
 * CREATE
 *
 * Authentication + role authorization happens before
 * accepting the upload.
 */
router.post(
  '/',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN,
  ),
  uploadImageMiddleware.single('image'),
  validateBody(createLibrarySchema),
  createLibraryResource,
);

/*
 * UPDATE
 */
router.patch(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN,
  ),
  validateParams(libraryIdSchema),
  uploadImageMiddleware.single('image'),
  validateBody(updateLibrarySchema),
  updateLibraryResource,
);

/*
 * DELETE
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN,
  ),
  validateParams(libraryIdSchema),
  deleteLibraryResource,
);

export default router;