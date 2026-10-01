import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(8).max(128),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(128),
}).strict();

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
}).strict();

export const resetPasswordSchema = z.object({
  token: z.string().min(1).max(255),
  newPassword: z.string().min(8).max(128),
}).strict();
