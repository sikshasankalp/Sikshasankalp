import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { 
  createProgramSchema, 
  updateProgramSchema, 
  programIdSchema, 
  programQuerySchema 
} from '../validators/program.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';
import {
  listPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../controllers/program.controller';

const router = Router();

// Inline validators for query and params
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
router.get('/', validateQuery(programQuerySchema), listPrograms);
router.get('/:id', validateParams(programIdSchema), getProgramById);

// Admin WRITE
router.post(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateBody(createProgramSchema),
  createProgram
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(programIdSchema),
  validateBody(updateProgramSchema),
  updateProgram
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(programIdSchema),
  deleteProgram
);

export default router;
