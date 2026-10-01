import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import { Role } from '@prisma/client';
import { AppError } from '../errors/AppError';

export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Unauthorized', 401));
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      next(new AppError('Forbidden', 403));
      return;
    }

    next();
  };
};
