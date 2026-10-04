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

import {
  createDonationOrderSchema,
  verifyDonationSchema,
  donationIdSchema,
  donationQuerySchema
} from '../validators/donation.validator';

import { AppError } from '../errors/AppError';

import {
  listDonations,
  getDonationById,
  getMyDonations,
  downloadMyDonationReceipt,
  createDonationOrder,
  verifyDonationPayment,
  processRazorpayWebhook,
  downloadDonationReceipt
} from '../controllers/donation.controller';

const router = Router();

const validateQuery =
  (schema: ZodSchema) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
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
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(new AppError('Invalid request parameters', 400));
      return;
    }

    Object.assign(req.params, result.data);
    next();
  };

/**
 * Authenticated user donation endpoints
 */

router.get(
  '/my',
  requireAuth,
  validateQuery(donationQuerySchema),
  getMyDonations
);

router.get(
  '/:id/receipt',
  requireAuth,
  validateParams(donationIdSchema),
  downloadMyDonationReceipt
);

router.post(
  '/order',
  requireAuth,
  validateBody(createDonationOrderSchema),
  createDonationOrder
);

router.post(
  '/verify',
  validateBody(verifyDonationSchema),
  verifyDonationPayment
);

/**
 * Razorpay webhook
 *
 * Public endpoint by design.
 * Authentication is provided by Razorpay HMAC
 * signature verification in the controller/service.
 *
 * The raw request body must be captured by app-level
 * middleware before this route executes.
 */
router.post(
  '/webhook',
  processRazorpayWebhook
);

/**
 * Public receipt download
 */
router.get(
  '/receipt/:token',
  downloadDonationReceipt
);

/**
 * Admin donation endpoints
 */

router.get(
  '/',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.FINANCE_ADMIN
  ),
  validateQuery(donationQuerySchema),
  listDonations
);

router.get(
  '/:id',
  requireAuth,
  requireRole(
    Role.SUPER_ADMIN,
    Role.FINANCE_ADMIN
  ),
  validateParams(donationIdSchema),
  getDonationById
);

export default router;