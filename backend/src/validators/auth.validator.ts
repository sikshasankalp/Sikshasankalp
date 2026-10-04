import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Invalid email address')
      .max(255, 'Email is too long'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long')
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Invalid email address')
      .max(255, 'Email is too long'),

    password: z
      .string()
      .min(1, 'Password is required')
      .max(128, 'Password is too long')
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Invalid email address')
      .max(255, 'Email is too long')
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .regex(
        /^[a-fA-F0-9]{64}$/,
        'Invalid or expired reset token'
      ),

    newPassword: z
      .string()
      .min(
        8,
        'Password must be at least 8 characters'
      )
      .max(
        128,
        'Password is too long'
      )
  })
  .strict();