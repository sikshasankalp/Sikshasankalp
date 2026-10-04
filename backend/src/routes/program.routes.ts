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
import {
  validateBody
} from '../middleware/validate.middleware';
import {
  uploadImageMiddleware
} from '../middleware/upload.middleware';

import {
  createProgramSchema,
  updateProgramSchema,
  programIdSchema,
  programQuerySchema
} from '../validators/program.validator';

import { AppError } from '../errors/AppError';

import {
  listPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../controllers/program.controller';

const router = Router();

const validateQuery =
  (schema: ZodSchema) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const result =
      schema.safeParse(req.query);

    if (!result.success) {
      next(
        new AppError(
          'Invalid query parameters',
          400
        )
      );
      return;
    }

    Object.assign(
      req.query,
      result.data
    );

    next();
  };

const validateParams =
  (schema: ZodSchema) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const result =
      schema.safeParse(req.params);

    if (!result.success) {
      next(
        new AppError(
          'Invalid request parameters',
          400
        )
      );
      return;
    }

    Object.assign(
      req.params,
      result.data
    );

    next();
  };

/**
 * Admin GET
 *
 * Must come before /:id.
 */
router.get(
  '/admin',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateQuery(
    programQuerySchema
  ),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listPrograms
);

/**
 * Public GET
 */
router.get(
  '/',
  validateQuery(
    programQuerySchema
  ),
  listPrograms
);

router.get(
  '/:id',
  validateParams(
    programIdSchema
  ),
  getProgramById
);

/**
 * Admin CREATE
 */
router.post(
  '/',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  uploadImageMiddleware.single('image'),
  validateBody(
    createProgramSchema
  ),
  createProgram
);

/**
 * Admin UPDATE
 */
router.patch(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(
    programIdSchema
  ),
  uploadImageMiddleware.single('image'),
  validateBody(
    updateProgramSchema
  ),
  updateProgram
);

/**
 * Admin DELETE
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(
    programIdSchema
  ),
  deleteProgram
);

export default router;