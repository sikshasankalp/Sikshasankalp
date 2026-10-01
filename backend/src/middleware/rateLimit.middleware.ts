import rateLimit from 'express-rate-limit';
import { AppError } from '../errors/AppError';
import { Request, Response, NextFunction } from 'express';

const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(message, 429));
    }
  });
};

export const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP, please try again after 15 minutes.'
);

export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20,
  'Too many authentication attempts, please try again after 15 minutes.'
);

export const strictAuthLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many sensitive operations requested, please try again after 15 minutes.'
);
