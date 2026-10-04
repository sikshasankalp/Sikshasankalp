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
  createTeamSchema,
  updateTeamSchema,
  teamIdSchema,
  teamQuerySchema
} from '../validators/team.validator';

import { AppError } from '../errors/AppError';

import {
  listTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/team.controller';

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
 * Must come before /:id so "admin" is not treated as
 * a team member ID.
 */
router.get(
  '/admin',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateQuery(teamQuerySchema),
  (req, res, next) => {
    res.locals.isAdmin = true;
    next();
  },
  listTeamMembers
);

/**
 * Public GET
 */
router.get(
  '/',
  validateQuery(teamQuerySchema),
  listTeamMembers
);

router.get(
  '/:id',
  validateParams(teamIdSchema),
  getTeamMemberById
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
  validateBody(createTeamSchema),
  createTeamMember
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(teamIdSchema),
  uploadImageMiddleware.single('image'),
  validateBody(updateTeamSchema),
  updateTeamMember
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.CONTENT_ADMIN
  ),
  validateParams(teamIdSchema),
  deleteTeamMember
);

export default router;