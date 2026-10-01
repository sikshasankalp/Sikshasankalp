import { z } from 'zod';
import crypto from 'crypto';

export const createDonationOrderSchema = z.object({
  donorName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150).optional().or(z.literal('')),
  mobile: z.string().trim().min(10).max(15),
  pan: z.string().trim().toUpperCase().max(20).optional().or(z.literal('')),
  address: z.string().trim().max(500).optional(),
  amount: z.number().positive().min(10), // minimum 10 INR for testing/small amounts
}).strict();

export const verifyDonationSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
}).strict();

export const donationIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const donationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  status: z.enum(['CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']).optional(),
  search: z.string().trim().max(100).optional(),
}).strict();

export type CreateDonationOrderInput = z.infer<typeof createDonationOrderSchema>;
export type VerifyDonationInput = z.infer<typeof verifyDonationSchema>;
export type DonationQueryInput = z.infer<typeof donationQuerySchema>;
