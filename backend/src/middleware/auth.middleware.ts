import {
  Response,
  NextFunction
} from 'express';

import jwt, {
  JwtPayload
} from 'jsonwebtoken';

import { config } from '../config/env';
import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { AuthRequest } from '../types/auth.types';

interface AccessTokenPayload extends JwtPayload {
  userId: string;
  role?: string;
}

const isAccessTokenPayload = (
  payload: string | JwtPayload
): payload is AccessTokenPayload => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof payload.userId === 'string' &&
    payload.userId.trim().length > 0
  );
};

const getBearerToken = (
  authorizationHeader: string | undefined
): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, credentials] =
    authorizationHeader.trim().split(/\s+/);

  if (
    scheme?.toLowerCase() !== 'bearer' ||
    !credentials ||
    credentials.trim().length === 0
  ) {
    return null;
  }

  return credentials.trim();
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | null =
      typeof req.cookies?.accessToken === 'string'
        ? req.cookies.accessToken.trim()
        : null;

    if (!token) {
      token = getBearerToken(
        req.headers.authorization
      );
    }

    if (!token) {
      next(
        new AppError(
          'Unauthorized',
          401
        )
      );
      return;
    }

    let decoded: string | JwtPayload;

    try {
      decoded = jwt.verify(
        token,
        config.jwt.access
      );
    } catch {
      next(
        new AppError(
          'Invalid or expired access token',
          401
        )
      );
      return;
    }

    if (!isAccessTokenPayload(decoded)) {
      next(
        new AppError(
          'Unauthorized',
          401
        )
      );
      return;
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          photoUrl: true,
          isActive: true,
          isVerified: true,
          passwordHash: true
        }
      });

    if (
      !user ||
      !user.isActive ||
      !user.isVerified
    ) {
      next(
        new AppError(
          'Unauthorized',
          401
        )
      );
      return;
    }

    /**
     * The database is the source of truth for the user's role.
     * We intentionally do not trust the role stored in the JWT.
     */
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
      isActive: user.isActive,
      isVerified: user.isVerified,
      hasPassword: Boolean(user.passwordHash)
    };

    next();
  } catch {
    next(
      new AppError(
        'Unauthorized',
        401
      )
    );
  }
};