import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { 
  createMediaSchema, 
  updateMediaSchema, 
  mediaIdSchema, 
  mediaQuerySchema 
} from '../validators/media.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';
import {
  listMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia
} from '../controllers/media.controller';

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
router.get('/', validateQuery(mediaQuerySchema), listMedia);
router.get('/:id', validateParams(mediaIdSchema), getMediaById);

// Admin WRITE
router.post(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateBody(createMediaSchema),
  createMedia
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(mediaIdSchema),
  validateBody(updateMediaSchema),
  updateMedia
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(mediaIdSchema),
  deleteMedia
);

export default router;
