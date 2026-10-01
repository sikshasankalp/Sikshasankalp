import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';
import { 
  createPartnerSchema, 
  updatePartnerSchema, 
  partnerIdSchema, 
  partnerQuerySchema 
} from '../validators/partner.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';
import {
  listPartnerInquiries,
  getPartnerInquiryById,
  createPartnerInquiry,
  updatePartnerInquiry,
  deletePartnerInquiry
} from '../controllers/partner.controller';

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

// Public POST (Rate Limited)
router.post(
  '/',
  apiLimiter,
  validateBody(createPartnerSchema),
  createPartnerInquiry
);

// Admin GET
router.get(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateQuery(partnerQuerySchema),
  listPartnerInquiries
);

router.get(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(partnerIdSchema),
  getPartnerInquiryById
);

// Admin WRITE (Update Status)
router.patch(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(partnerIdSchema),
  validateBody(updatePartnerSchema),
  updatePartnerInquiry
);

// Admin DELETE
router.delete(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'),
  validateParams(partnerIdSchema),
  deletePartnerInquiry
);

export default router;
