import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError';

const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
  options: {
    skip?: (req: Request) => boolean;
  } = {}
) => {
  return rateLimit({
    windowMs,
    max,

    standardHeaders: true,
    legacyHeaders: false,

    skip: options.skip,

    handler: (
      _req: Request,
      _res: Response,
      next: NextFunction
    ) => {
      next(new AppError(message, 429));
    }
  });
};

/**
 * Global API rate limiter.
 *
 * Applied to all /api routes from app.ts.
 *
 * Razorpay webhook is excluded because:
 * - it is an external payment-provider callback
 * - it already has HMAC signature verification
 * - rate limiting it globally could cause legitimate webhook
 *   deliveries/retries to be rejected
 */
export const apiLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again after 15 minutes.',
  {
    skip: (req) => req.path === '/donations/webhook'
  }
);

/**
 * Authentication rate limiter.
 *
 * Used on login/register/other authentication endpoints
 * where repeated attempts need stronger protection.
 */
export const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  20,
  'Too many authentication attempts, please try again after 15 minutes.'
);

/**
 * Strict rate limiter.
 *
 * Used for sensitive authentication operations such as
 * password reset, verification, or similar high-risk actions.
 */
export const strictAuthLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  'Too many sensitive operations requested, please try again after 15 minutes.'
);