import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';
import { 
  createVolunteerSchema, 
  updateVolunteerSchema, 
  volunteerIdSchema, 
  volunteerQuerySchema 
} from '../validators/volunteer.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';
import {
  listVolunteerApplications,
  getVolunteerApplicationById,
  createVolunteerApplication,
  updateVolunteerApplication,
  deleteVolunteerApplication
} from '../controllers/volunteer.controller';

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

// Public POST (Rate Limited via generalLimiter which should be applied on the index.ts or here)
// Wait, the generalLimiter is usually exported. Let's apply it just to be safe if not global.
// Assuming generalLimiter exists. If it doesn't, we can fall back to standard Express setup or omit if it breaks.
// The instructions said "Reuse the existing rate-limit infrastructure... use the project's existing general rate limiter"
router.post(
  '/',
  apiLimiter,
  validateBody(createVolunteerSchema),
  createVolunteerApplication
);

// Admin GET
router.get(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateQuery(volunteerQuerySchema),
  listVolunteerApplications
);

router.get(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(volunteerIdSchema),
  getVolunteerApplicationById
);

// Admin WRITE (Update Status)
router.patch(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(volunteerIdSchema),
  validateBody(updateVolunteerSchema),
  updateVolunteerApplication
);

// Admin DELETE
router.delete(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(volunteerIdSchema),
  deleteVolunteerApplication
);

export default router;
