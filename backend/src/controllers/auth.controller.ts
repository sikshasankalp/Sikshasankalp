import {
  Request,
  Response,
  NextFunction,
  CookieOptions
} from 'express';
import crypto from 'crypto';

import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema
} from '../validators/auth.validator';

import { AuthRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { googleAuthService } from '../services/google-auth.service';
import { AppError } from '../errors/AppError';
import { config } from '../config/env';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const GOOGLE_STATE_MAX_AGE = 10 * 60 * 1000;

const isProduction = config.nodeEnv === 'production';

const cookieOptionsBase: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/'
};

const accessTokenOptions: CookieOptions = {
  ...cookieOptionsBase,
  maxAge: ACCESS_TOKEN_MAX_AGE
};

const refreshTokenOptions: CookieOptions = {
  ...cookieOptionsBase,
  maxAge: REFRESH_TOKEN_MAX_AGE
};

const googleStateCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/api/auth/google',
  maxAge: GOOGLE_STATE_MAX_AGE
};

const generateOAuthState = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const safeEqualStrings = (
  expected: string,
  received: string
): boolean => {
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(received, 'utf8');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
};

const getSingleQueryValue = (
  value: unknown
): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
};

const clearGoogleStateCookie = (
  res: Response
): void => {
  res.clearCookie(
    'googleOAuthState',
    googleStateCookieOptions
  );
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError('Invalid request data', 400);
    }

    await authService.signup(parsed.data);

    res.set('Cache-Control', 'no-store');

    res.status(201).json({
      success: true,
      message:
        'Account created successfully. Please verify your email before logging in.'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getSingleQueryValue(req.params.token);

    if (!token) {
      throw new AppError(
        'Verification token missing',
        400
      );
    }

    await authService.verifyEmail(token);

    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = signupSchema
      .pick({
        email: true
      })
      .safeParse(req.body);

    if (!parsed.success) {
      throw new AppError('Invalid email', 400);
    }

    await authService.resendVerificationEmail(
      parsed.data.email
    );

    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      message:
        'If the account requires verification, a verification email has been sent.'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        'Invalid email or password',
        400
      );
    }

    const {
      accessToken,
      refreshToken,
      user
    } = await authService.login(parsed.data);

    res.cookie(
      'accessToken',
      accessToken,
      accessTokenOptions
    );

    res.cookie(
      'refreshToken',
      refreshToken,
      refreshTokenOptions
    );

    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const state = generateOAuthState();

    res.cookie(
      'googleOAuthState',
      state,
      googleStateCookieOptions
    );

    const url =
      googleAuthService.getAuthorizationUrl(state);

    res.redirect(url);
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('[GoogleOAuth Callback] Callback reached');

    const code = getSingleQueryValue(
      req.query.code
    );

    const receivedState =
      getSingleQueryValue(req.query.state);

    const storedState =
      getSingleQueryValue(
        req.cookies?.googleOAuthState
      );

    const hasCode = Boolean(code);
    const hasReceivedState = Boolean(receivedState);
    const hasStoredState = Boolean(storedState);
    const isStateValid = Boolean(
      storedState &&
      receivedState &&
      safeEqualStrings(storedState, receivedState)
    );

    console.log(
      `[GoogleOAuth Callback] State verification check: hasCode=${hasCode}, hasReceivedState=${hasReceivedState}, hasStoredState=${hasStoredState}, stateMatch=${isStateValid}`
    );

    if (
      !code ||
      !receivedState ||
      !storedState ||
      !isStateValid
    ) {
      console.warn('[GoogleOAuth Callback] State verification failure');
      clearGoogleStateCookie(res);

      res.set('Cache-Control', 'no-store');

      const failureRedirect = `${config.frontendUrl}/login?error=GoogleAuthFailed`;
      console.log('[GoogleOAuth Callback] Final redirect URL:', failureRedirect);
      res.redirect(failureRedirect);

      return;
    }

    console.log('[GoogleOAuth Callback] State verification success');
    clearGoogleStateCookie(res);

    const {
      accessToken,
      refreshToken
    } = await authService.handleGoogleLogin(
      code
    );

    console.log('[GoogleOAuth Callback] Google profile/user resolved');
    console.log('[GoogleOAuth Callback] Token generation success');

    console.log('[GoogleOAuth Callback] Cookie-setting reached');
    res.cookie(
      'accessToken',
      accessToken,
      accessTokenOptions
    );

    res.cookie(
      'refreshToken',
      refreshToken,
      refreshTokenOptions
    );

    res.set('Cache-Control', 'no-store');

    const successRedirect = config.frontendUrl;
    console.log('[GoogleOAuth Callback] Final redirect URL:', successRedirect);
    res.redirect(successRedirect);
  } catch (error) {
    console.error(
      '[GoogleOAuth Callback] OAuth failure:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    clearGoogleStateCookie(res);

    res.set('Cache-Control', 'no-store');

    const errorRedirect = `${config.frontendUrl}/login?error=GoogleAuthFailed`;
    console.log('[GoogleOAuth Callback] Final redirect URL:', errorRedirect);
    res.redirect(errorRedirect);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken =
      req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie(
      'accessToken',
      cookieOptionsBase
    );

    res.clearCookie(
      'refreshToken',
      cookieOptionsBase
    );

    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  res.set('Cache-Control', 'no-store');

  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        photoUrl: req.user.photoUrl
      }
    }
  });
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken =
      req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        'Refresh token missing',
        401
      );
    }

    const tokens =
      await authService.refreshAccessToken(
        refreshToken
      );

    res.cookie(
      'accessToken',
      tokens.accessToken,
      accessTokenOptions
    );

    res.cookie(
      'refreshToken',
      tokens.refreshToken,
      refreshTokenOptions
    );

    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      message: 'Token refreshed'
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed =
      forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        'Invalid email',
        400
      );
    }

    await authService.forgotPassword(
      parsed.data.email
    );

    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      message:
        'If the email exists, a password reset link has been sent.'
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed =
      resetPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        'Invalid request data',
        400
      );
    }

    await authService.resetPassword(
      parsed.data
    );

    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};