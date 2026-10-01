import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { 
  createTeamSchema, 
  updateTeamSchema, 
  teamIdSchema, 
  teamQuerySchema 
} from '../validators/team.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';
import {
  listTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/team.controller';

const router = Router();

const validateQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    next(new AppError('Invalid query parameters', 400));
    return;
  }
  Object.assign(req.query, result.data);
  next();
};

const validateParams = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    next(new AppError('Invalid request parameters', 400));
    return;
  }
  Object.assign(req.params, result.data);
  next();
};

// Public GET
router.get('/', validateQuery(teamQuerySchema), listTeamMembers);
router.get('/:id', validateParams(teamIdSchema), getTeamMemberById);

// Admin WRITE
router.post(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateBody(createTeamSchema),
  createTeamMember
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(teamIdSchema),
  validateBody(updateTeamSchema),
  updateTeamMember
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(teamIdSchema),
  deleteTeamMember
);

export default router;
