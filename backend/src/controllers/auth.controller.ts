import { Request, Response, NextFunction, CookieOptions } from 'express';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema, signupSchema } from '../validators/auth.validator';
import { AuthRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { AppError } from '../errors/AppError';

const cookieOptionsBase: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
};

const accessTokenOptions: CookieOptions = {
  ...cookieOptionsBase,
  maxAge: 15 * 60 * 1000 // 15 mins
};

const refreshTokenOptions: CookieOptions = {
  ...cookieOptionsBase,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid request data', 400);
    }

    await authService.signup(parsed.data);

    res.set('Cache-Control', 'no-store');
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email before logging in.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.params.token as string;
    if (!token) {
      throw new AppError('Verification token missing', 400);
    }

    await authService.verifyEmail(token);

    res.set('Cache-Control', 'no-store');
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError('Email is required', 400);
    }

    await authService.resendVerificationEmail(email);

    res.set('Cache-Control', 'no-store');
    res.json({ 
      success: true, 
      message: 'If the account requires verification, a verification email has been sent.' 
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid email or password', 400);
    }

    const { accessToken, refreshToken, user } = await authService.login(parsed.data);

    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('accessToken', cookieOptionsBase);
    res.clearCookie('refreshToken', cookieOptionsBase);

    res.set('Cache-Control', 'no-store');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new AppError('Refresh token missing', 401);
    }

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.cookie('accessToken', tokens.accessToken, accessTokenOptions);
    res.cookie('refreshToken', tokens.refreshToken, refreshTokenOptions);

    res.set('Cache-Control', 'no-store');
    res.json({ success: true, message: 'Token refreshed' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid email', 400);
    }

    await authService.forgotPassword(parsed.data.email);
    
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, message: 'If the email exists, a password reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError('Invalid request data', 400);
    }

    await authService.resetPassword(parsed.data);

    res.set('Cache-Control', 'no-store');
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
