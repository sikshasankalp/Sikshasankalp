import bcrypt from 'bcrypt';
import jwt, {
  JwtPayload,
  SignOptions
} from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';

import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';

import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyAdminOtpSchema
} from '../validators/auth.validator';
import { Role } from '@prisma/client';

import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendAdminLoginOtpEmail
} from '../utils/email';

import { googleAuthService } from './google-auth.service';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

const EMAIL_VERIFICATION_TTL_MS =
  24 * 60 * 60 * 1000;

const PASSWORD_RESET_TTL_MS =
  15 * 60 * 1000;

type RefreshTokenPayload = JwtPayload & {
  userId: string;
};

const generateAccessToken = (
  userId: string,
  role: string
): string => {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  };

  return jwt.sign(
    {
      userId,
      role
    },
    config.jwt.access,
    options
  );
};

const generateRefreshToken = (
  userId: string
): string => {
  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  };

  return jwt.sign(
    {
      userId
    },
    config.jwt.refresh,
    options
  );
};

const hashToken = (token: string): string => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const createVerificationToken = () => {
  const rawToken = crypto
    .randomBytes(32)
    .toString('hex');

  return {
    rawToken,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(
      Date.now() + EMAIL_VERIFICATION_TTL_MS
    )
  };
};

const createPasswordResetToken = () => {
  const rawToken = crypto
    .randomBytes(32)
    .toString('hex');

  return {
    rawToken,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(
      Date.now() + PASSWORD_RESET_TTL_MS
    )
  };
};

const getRefreshTokenPayload = (
  token: string
): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.refresh
    );

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.userId !== 'string' ||
      decoded.userId.trim().length === 0
    ) {
      throw new Error('Invalid refresh token payload');
    }

    return decoded as RefreshTokenPayload;
  } catch {
    throw new AppError(
      'Invalid or expired refresh token',
      401
    );
  }
};

const getSafeUser = (user: {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: string;
  photoUrl: string | null;
  passwordHash?: string | null;
}) => {
  return {
    id: user.id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    photoUrl: user.photoUrl,
    hasPassword: Boolean(user.passwordHash)
  };
};

export const authService = {
  async signup(
    payload: z.infer<typeof signupSchema>
  ) {
    const emailNormalized = normalizeEmail(
      payload.email
    );

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: emailNormalized
        }
      });

    if (existingUser) {
      // Do not reveal whether the account already exists.
      return;
    }

    const passwordHash = await bcrypt.hash(
      payload.password,
      12
    );

    const verification =
      createVerificationToken();

    const user = await prisma.user.create({
      data: {
        name: payload.name.trim(),
        email: emailNormalized,
        passwordHash,
        emailVerifyTokenHash:
          verification.tokenHash,
        emailVerifyExpiry:
          verification.expiresAt,
        role: 'PUBLIC_USER',
        isVerified: false,
        isActive: true
      }
    });

    const verifyLink =
      `${config.frontendUrl}/verify-email/` +
      verification.rawToken;

    try {
      await sendVerificationEmail(
        user.email,
        verifyLink
      );
    } catch (error) {
      // Keep the account and verification token so the
      // user can use "resend verification email".
      throw error;
    }
  },

  async verifyEmail(token: string) {
    const normalizedToken = token.trim();

    if (!normalizedToken) {
      throw new AppError(
        'Invalid or expired verification link',
        400
      );
    }

    const hashedToken =
      hashToken(normalizedToken);

    const user =
      await prisma.user.findFirst({
        where: {
          emailVerifyTokenHash: hashedToken,
          emailVerifyExpiry: {
            gt: new Date()
          }
        }
      });

    if (!user) {
      throw new AppError(
        'Invalid or expired verification link',
        400
      );
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isVerified: true,
        emailVerifyTokenHash: null,
        emailVerifyExpiry: null
      }
    });
  },

  async resendVerificationEmail(
    email: string
  ) {
    const emailNormalized =
      normalizeEmail(email);

    const user =
      await prisma.user.findUnique({
        where: {
          email: emailNormalized
        }
      });

    if (!user || user.isVerified) {
      // Prevent account enumeration.
      return;
    }

    const verification =
      createVerificationToken();

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerifyTokenHash:
          verification.tokenHash,
        emailVerifyExpiry:
          verification.expiresAt
      }
    });

    const verifyLink =
      `${config.frontendUrl}/verify-email/` +
      verification.rawToken;

    await sendVerificationEmail(
      user.email,
      verifyLink
    );
  },

  async login(
    payload: z.infer<typeof loginSchema>
  ) {
    const emailNormalized =
      normalizeEmail(payload.email);

    const user =
      await prisma.user.findUnique({
        where: {
          email: emailNormalized
        }
      });

    if (!user || !user.isActive) {
      throw new AppError(
        'Invalid email or password',
        401
      );
    }

    if (!user.passwordHash) {
      throw new AppError(
        'Invalid email or password',
        401
      );
    }

    const isMatch =
      await bcrypt.compare(
        payload.password,
        user.passwordHash
      );

    if (!isMatch) {
      throw new AppError(
        'Invalid email or password',
        401
      );
    }

    if (!user.isVerified) {
      throw new AppError(
        'Please verify your email before logging in.',
        403
      );
    }

    const isAdmin = user.role !== Role.PUBLIC_USER;

    if (isAdmin) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpHash = hashToken(otp);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorOtpHash: otpHash,
          twoFactorOtpExpiry: otpExpiry
        }
      });

      try {
        await sendAdminLoginOtpEmail(user.email, otp);
      } catch (err) {
        console.error('[2FA] Failed to send admin OTP email:', err);
        throw new AppError('Failed to send verification code to admin email. Please try again.', 500);
      }

      const tempToken = jwt.sign(
        { userId: user.id, email: user.email, purpose: 'admin_2fa' },
        config.jwt.access,
        { expiresIn: '10m' }
      );

      const [local, domain] = user.email.split('@');
      const maskedEmail = domain ? `${local.slice(0, 3)}***@${domain}` : user.email;

      return {
        requireOtp: true as const,
        tempToken,
        email: maskedEmail,
        message: 'A 6-digit verification code has been sent to your email.'
      };
    }

    const accessToken =
      generateAccessToken(
        user.id,
        user.role
      );

    const refreshToken =
      generateRefreshToken(user.id);

    const refreshTokenHash =
      hashToken(refreshToken);

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date(),
        refreshTokenHash
      }
    });

    return {
      requireOtp: false as const,
      accessToken,
      refreshToken,
      user: getSafeUser(user)
    };
  },

  async verifyAdminOtp(
    payload: z.infer<typeof verifyAdminOtpSchema>
  ) {
    let decoded: any;
    try {
      decoded = jwt.verify(payload.tempToken, config.jwt.access);
    } catch {
      throw new AppError('2FA verification session has expired. Please sign in again.', 401);
    }

    if (!decoded || decoded.purpose !== 'admin_2fa' || !decoded.userId) {
      throw new AppError('Invalid 2FA session token.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      throw new AppError('Account not found or inactive.', 401);
    }

    if (!user.twoFactorOtpHash || !user.twoFactorOtpExpiry) {
      throw new AppError('No pending 2FA code found. Please sign in again.', 400);
    }

    if (user.twoFactorOtpExpiry < new Date()) {
      throw new AppError('Verification code has expired. Please request a new code.', 400);
    }

    const incomingHash = hashToken(payload.otp.trim());
    if (user.twoFactorOtpHash !== incomingHash) {
      throw new AppError('Incorrect verification code. Please check and try again.', 400);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        refreshTokenHash,
        twoFactorOtpHash: null,
        twoFactorOtpExpiry: null
      }
    });

    return {
      accessToken,
      refreshToken,
      user: getSafeUser(user)
    };
  },

  async resendAdminOtp(rawTempToken: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(rawTempToken, config.jwt.access);
    } catch {
      throw new AppError('2FA session has expired. Please sign in again.', 401);
    }

    if (!decoded || decoded.purpose !== 'admin_2fa' || !decoded.userId) {
      throw new AppError('Invalid 2FA session token.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      throw new AppError('Account not found or inactive.', 401);
    }

    if (user.twoFactorOtpExpiry) {
      const remainingMs = user.twoFactorOtpExpiry.getTime() - Date.now();
      if (remainingMs > 9 * 60 * 1000 + 15 * 1000) {
        throw new AppError('Please wait at least 45 seconds before requesting a new code.', 429);
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashToken(otp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorOtpHash: otpHash,
        twoFactorOtpExpiry: otpExpiry
      }
    });

    try {
      await sendAdminLoginOtpEmail(user.email, otp);
    } catch (err) {
      console.error('[2FA] Failed to resend admin OTP email:', err);
      throw new AppError('Failed to send verification code email. Please try again.', 500);
    }

    return {
      success: true,
      message: 'A fresh 6-digit verification code has been sent to your email.'
    };
  },

  async handleGoogleLogin(
    code: string
  ) {
    if (!code || !code.trim()) {
      throw new AppError(
        'Invalid Google authorization code',
        400
      );
    }

    const profile =
      await googleAuthService
        .verifyAndExtractProfileFromCode(
          code
        );

    const emailNormalized =
      normalizeEmail(profile.email);

    let user =
      await prisma.user.findUnique({
        where: {
          googleId: profile.googleId
        }
      });

    if (!user) {
      user =
        await prisma.user.findUnique({
          where: {
            email: emailNormalized
          }
        });

      if (user) {
        user =
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              googleId: profile.googleId,
              photoUrl:
                user.photoUrl ||
                profile.photoUrl ||
                ''
            }
          });
      } else {
        user =
          await prisma.user.create({
            data: {
              name: profile.name.trim(),
              email: emailNormalized,
              googleId: profile.googleId,
              photoUrl:
                profile.photoUrl || '',
              isVerified: true,
              isActive: true,
              role: 'PUBLIC_USER'
            }
          });
      }
    }

    if (!user.isActive) {
      throw new AppError(
        'Invalid email or password',
        401
      );
    }

    const accessToken =
      generateAccessToken(
        user.id,
        user.role
      );

    const refreshToken =
      generateRefreshToken(user.id);

    const refreshTokenHash =
      hashToken(refreshToken);

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date(),
        refreshTokenHash
      }
    });

    return {
      accessToken,
      refreshToken,
      user: getSafeUser(user)
    };
  },

  async logout(
    refreshToken: string
  ) {
    const token = refreshToken?.trim();

    if (!token) {
      return;
    }

    const refreshTokenHash =
      hashToken(token);

    await prisma.user.updateMany({
      where: {
        refreshTokenHash
      },
      data: {
        refreshTokenHash: null
      }
    });
  },

  async refreshAccessToken(
    token: string
  ) {
    const normalizedToken = token.trim();

    if (!normalizedToken) {
      throw new AppError(
        'Invalid or expired refresh token',
        401
      );
    }

    const decoded =
      getRefreshTokenPayload(
        normalizedToken
      );

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId
        }
      });

    if (!user || !user.isActive) {
      throw new AppError(
        'Invalid or expired refresh token',
        401
      );
    }

    const calculatedHash =
      hashToken(normalizedToken);

    if (
      !user.refreshTokenHash ||
      user.refreshTokenHash !==
        calculatedHash
    ) {
      throw new AppError(
        'Invalid or expired refresh token',
        401
      );
    }

    if (!user.isVerified) {
      throw new AppError(
        'Please verify your email before logging in.',
        403
      );
    }

    const newAccessToken =
      generateAccessToken(
        user.id,
        user.role
      );

    const newRefreshToken =
      generateRefreshToken(user.id);

    const newRefreshTokenHash =
      hashToken(newRefreshToken);

    /**
     * Atomic token rotation:
     *
     * Only rotate if the currently stored hash is still
     * the hash of the token supplied by the client.
     *
     * This prevents the same refresh token from being
     * successfully rotated twice in concurrent requests.
     */
    const rotationResult =
      await prisma.user.updateMany({
        where: {
          id: user.id,
          refreshTokenHash:
            calculatedHash
        },
        data: {
          refreshTokenHash:
            newRefreshTokenHash
        }
      });

    if (rotationResult.count !== 1) {
      throw new AppError(
        'Invalid or expired refresh token',
        401
      );
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  },

  async forgotPassword(
    email: string
  ) {
    const emailNormalized =
      normalizeEmail(email);

    const user =
      await prisma.user.findUnique({
        where: {
          email: emailNormalized
        }
      });

    if (!user || !user.isActive) {
      // Prevent account enumeration.
      return;
    }

    const reset =
      createPasswordResetToken();

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        resetPasswordTokenHash:
          reset.tokenHash,
        resetPasswordExpiry:
          reset.expiresAt
      }
    });

    const resetLink =
      `${config.frontendUrl}/reset-password/` +
      reset.rawToken;

    // Dispatch reset email asynchronously in background so client receives an immediate response (<100ms)
    sendResetPasswordEmail(user.email, resetLink).catch((emailError) => {
      console.error('[AuthService] Failed to send password reset email in background:', emailError);
    });
  },

  async resetPassword(
    payload: z.infer<
      typeof resetPasswordSchema
    >
  ) {
    const token = payload.token.trim();

    if (!token) {
      throw new AppError(
        'Invalid or expired reset token',
        400
      );
    }

    const hashedToken =
      hashToken(token);

    const user =
      await prisma.user.findFirst({
        where: {
          resetPasswordTokenHash:
            hashedToken,
          resetPasswordExpiry: {
            gt: new Date()
          }
        }
      });

    if (!user || !user.isActive) {
      throw new AppError(
        'Invalid or expired reset token',
        400
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        payload.newPassword,
        12
      );

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        passwordHash: hashedPassword,
        resetPasswordTokenHash: null,
        resetPasswordExpiry: null,

        // Invalidate the existing refresh session.
        refreshTokenHash: null
      }
    });
  },

  async setPassword(
    userId: string,
    newPasswordPlain: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 404);
    }

    const hashedPassword = await bcrypt.hash(newPasswordPlain, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword
      }
    });
  }
};