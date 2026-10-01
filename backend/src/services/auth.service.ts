import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';
import { z } from 'zod';
import { loginSchema, resetPasswordSchema, signupSchema } from '../validators/auth.validator';
import { sendResetPasswordEmail, sendVerificationEmail } from '../utils/email';
import { googleAuthService } from './google-auth.service';

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, config.jwt.access, { expiresIn: '15m' });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwt.refresh, { expiresIn: '7d' });
};

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const authService = {
  async signup(payload: z.infer<typeof signupSchema>) {
    const { email, password, name } = payload;
    
    const emailNormalized = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: emailNormalized } });

    if (existingUser) {
      // Do not throw 'User already exists' to prevent enumeration
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyTokenHash = hashToken(rawVerifyToken);
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailNormalized,
        passwordHash,
        emailVerifyTokenHash,
        emailVerifyExpiry,
        role: 'PUBLIC_USER'
      }
    });

    const verifyLink = `${config.frontendUrl}/verify-email/${rawVerifyToken}`;
    await sendVerificationEmail(user.email, verifyLink);
  },

  async verifyEmail(token: string) {
    const hashedToken = hashToken(token);
    
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyTokenHash: hashedToken,
        emailVerifyExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired verification link', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerifyTokenHash: null,
        emailVerifyExpiry: null
      }
    });
  },

  async resendVerificationEmail(email: string) {
    const emailNormalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: emailNormalized } });
    
    if (!user || user.isVerified) {
      // Return silently to prevent enumeration
      return;
    }

    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyTokenHash = hashToken(rawVerifyToken);
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyTokenHash, emailVerifyExpiry }
    });

    const verifyLink = `${config.frontendUrl}/verify-email/${rawVerifyToken}`;
    await sendVerificationEmail(user.email, verifyLink);
  },

  async login(payload: z.infer<typeof loginSchema>) {
    const { email, password } = payload;
    const emailNormalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: emailNormalized } });

    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.passwordHash) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isVerified) {
      throw new AppError('Please verify your email before logging in.', 403);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    
    const rawRefreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = hashToken(rawRefreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginAt: new Date(),
        refreshTokenHash
      }
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl
      }
    };
  },

  async handleGoogleLogin(code: string) {
    const profile = await googleAuthService.verifyAndExtractProfileFromCode(code);
    const emailNormalized = profile.email.toLowerCase().trim();

    let user = await prisma.user.findUnique({ where: { googleId: profile.googleId } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email: emailNormalized } });
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { 
            googleId: profile.googleId,
            photoUrl: user.photoUrl || profile.photoUrl || ''
          }
        });
      } else {
        user = await prisma.user.create({
          data: {
            name: profile.name,
            email: emailNormalized,
            googleId: profile.googleId,
            photoUrl: profile.photoUrl || '',
            isVerified: true,
            role: 'PUBLIC_USER'
          }
        });
      }
    }

    if (!user.isActive) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const rawRefreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = hashToken(rawRefreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginAt: new Date(),
        refreshTokenHash
      }
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl
      }
    };
  },

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    
    const refreshTokenHash = hashToken(refreshToken);
    
    await prisma.user.updateMany({
      where: { refreshTokenHash },
      data: { refreshTokenHash: null }
    });
  },

  async refreshAccessToken(token: string) {
    let decoded: { userId: string };
    
    try {
      decoded = jwt.verify(token, config.jwt.refresh) as { userId: string };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    
    if (!user || !user.isActive) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const calculatedHash = hashToken(token);
    if (user.refreshTokenHash !== calculatedHash) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    if (!user.isVerified) {
       throw new AppError('Please verify your email before logging in.', 403);
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    
    const newRawRefreshToken = generateRefreshToken(user.id);
    const newRefreshTokenHash = hashToken(newRawRefreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: newRefreshTokenHash }
    });

    return { accessToken: newAccessToken, refreshToken: newRawRefreshToken };
  },

  async forgotPassword(email: string) {
    const emailNormalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: emailNormalized } });
    
    if (!user || !user.isActive) {
      // Don't reveal if user exists
      return;
    }

    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordTokenHash = hashToken(rawResetToken);
    const resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordTokenHash,
        resetPasswordExpiry
      }
    });

    const resetLink = `${config.frontendUrl}/reset-password/${rawResetToken}`;
    await sendResetPasswordEmail(user.email, resetLink);
  },

  async resetPassword(payload: z.infer<typeof resetPasswordSchema>) {
    const { token, newPassword } = payload;
    const hashedToken = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordTokenHash: hashedToken,
        resetPasswordExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetPasswordTokenHash: null,
        resetPasswordExpiry: null,
        refreshTokenHash: null // Invalidate existing refresh sessions
      }
    });
  }
};
