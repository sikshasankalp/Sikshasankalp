import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { AuthRequest } from '../types/auth.types';
import { User } from '@prisma/client';

interface AccessTokenPayload {
  userId: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.accessToken as string | undefined;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      next(new AppError('Unauthorized', 401));
      return;
    }

    let decoded: AccessTokenPayload;
    try {
      decoded = jwt.verify(token, config.jwt.access) as AccessTokenPayload;
    } catch (error) {
      next(new AppError('Invalid or expired access token', 401));
      return;
    }

    if (!decoded || typeof decoded.userId !== 'string') {
      next(new AppError('Unauthorized', 401));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        photoUrl: true,
        isActive: true,
        isVerified: true
      }
    });

    if (!user || !user.isActive) {
      next(new AppError('Unauthorized', 401));
      return;
    }

    req.user = user as User;
    next();
  } catch (error) {
    next(new AppError('Unauthorized', 401));
  }
};
