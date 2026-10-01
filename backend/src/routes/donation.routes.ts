import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';
import { 
  createDonationOrderSchema, 
  verifyDonationSchema, 
  donationIdSchema, 
  donationQuerySchema 
} from '../validators/donation.validator';
import { AppError } from '../errors/AppError';
import { ZodSchema } from 'zod';
import {
  listDonations,
  getDonationById,
  createDonationOrder,
  verifyDonationPayment,
  processRazorpayWebhook
} from '../controllers/donation.controller';

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

// Public Endpoints
router.post(
  '/order',
  apiLimiter,
  validateBody(createDonationOrderSchema),
  createDonationOrder
);

router.post(
  '/verify',
  apiLimiter,
  validateBody(verifyDonationSchema),
  verifyDonationPayment
);

// Webhook (Public, but verified via HMAC signature, so no rate limit to avoid dropping events)
router.post(
  '/webhook',
  processRazorpayWebhook
);

// Admin Endpoints
router.get(
  '/',
  requireAuth,
  requireRole('SUPER_ADMIN', 'FINANCE_ADMIN'),
  validateQuery(donationQuerySchema),
  listDonations
);

router.get(
  '/:id',
  requireAuth,
  requireRole('SUPER_ADMIN', 'FINANCE_ADMIN'),
  validateParams(donationIdSchema),
  getDonationById
);

export default router;
