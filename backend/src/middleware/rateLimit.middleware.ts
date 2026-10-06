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
    validate: {
      trustProxy: false,
      xForwardedForHeader: false,
      default: false
    },

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
 * Excludes payment webhooks and OPTIONS preflight.
 * Generous threshold (3000 requests / 15 min) so public gallery/pages
 * never get blocked during normal browsing.
 */
export const apiLimiter = createRateLimiter(
  15 * 60 * 1000,
  3000,
  'Too many requests from this IP, please try again after 15 minutes.',
  {
    skip: (req) => req.path === '/donations/webhook' || req.method === 'OPTIONS'
  }
);

/**
 * Authentication rate limiter.
 *
 * Used on login endpoints. 60 attempts in 5 minutes window.
 */
export const authLimiter = createRateLimiter(
  5 * 60 * 1000,
  60,
  'Too many authentication attempts, please try again after 5 minutes.'
);

/**
 * Strict rate limiter.
 *
 * Used for sensitive authentication operations such as
 * password reset or verification.
 */
export const strictAuthLimiter = createRateLimiter(
  10 * 60 * 1000,
  20,
  'Too many sensitive operations requested, please try again after 10 minutes.'
);