import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { 
  createLibrarySchema, 
  updateLibrarySchema, 
  libraryIdSchema, 
  libraryQuerySchema 
} from '../validators/library.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';
import {
  listLibraryResources,
  getLibraryResourceById,
  createLibraryResource,
  updateLibraryResource,
  deleteLibraryResource
} from '../controllers/library.controller';

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
router.get('/', validateQuery(libraryQuerySchema), listLibraryResources);
router.get('/:id', validateParams(libraryIdSchema), getLibraryResourceById);

// Admin WRITE
router.post(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateBody(createLibrarySchema),
  createLibraryResource
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(libraryIdSchema),
  validateBody(updateLibrarySchema),
  updateLibraryResource
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(libraryIdSchema),
  deleteLibraryResource
);

export default router;
