import { z } from 'zod';

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email address')
  .max(150)
  .optional()
  .or(z.literal(''));

const panSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    'Invalid PAN format',
  )
  .optional()
  .or(z.literal(''));

const mobileSchema = z
  .string()
  .trim()
  .transform((val) => {
    let cleaned = val.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+91') && cleaned.length === 13) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  })
  .refine(
    (val) => /^\+?[1-9]\d{9,14}$/.test(val),
    'Invalid mobile number',
  );

/**
 * Donation amount is stored in INR in the database
 * and converted to paise before sending to Razorpay.
 *
 * We therefore:
 * - require at least ₹10
 * - allow maximum 2 decimal places
 * - reject non-finite values
 * - cap extremely large client-side requests
 */
const donationAmountSchema = z
  .number()
  .finite()
  .min(10, 'Minimum donation amount is ₹10')
  .max(10_000_000, 'Donation amount is too large')
  .refine(
    (value) => Number.isInteger(value * 100),
    'Donation amount can have at most 2 decimal places',
  );

export const createDonationOrderSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .max(50, 'First name is too long')
      .optional(),

    lastName: z
      .string()
      .trim()
      .max(50, 'Last name is too long')
      .optional(),

    donorName: z
      .string()
      .trim()
      .min(2, 'Donor name must be at least 2 characters')
      .max(100, 'Donor name is too long'),

    email: optionalEmail,

    mobile: mobileSchema,

    pan: panSchema,

    address: z
      .string()
      .trim()
      .max(500, 'Address is too long')
      .optional()
      .or(z.literal('')),

    amount: donationAmountSchema,
  })
  .strict();

export const verifyDonationSchema = z
  .object({
    razorpay_order_id: z
      .string()
      .trim()
      .regex(
        /^order_[A-Za-z0-9]+$/,
        'Invalid Razorpay order ID',
      ),

    razorpay_payment_id: z
      .string()
      .trim()
      .regex(
        /^pay_[A-Za-z0-9]+$/,
        'Invalid Razorpay payment ID',
      ),

    razorpay_signature: z
      .string()
      .trim()
      .regex(
        /^[a-fA-F0-9]{64}$/,
        'Invalid Razorpay signature',
      ),
  })
  .strict();

export const donationIdSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export const donationQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .positive()
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(50)
      .default(12),

    status: z
      .enum([
        'CREATED',
        'PENDING',
        'SUCCESS',
        'FAILED',
        'REFUNDED',
      ])
      .optional(),

    search: z
      .string()
      .trim()
      .max(100)
      .optional(),
  })
  .strict();

export type CreateDonationOrderInput = z.infer<
  typeof createDonationOrderSchema
>;

export type VerifyDonationInput = z.infer<
  typeof verifyDonationSchema
>;

export type DonationQueryInput = z.infer<
  typeof donationQuerySchema
>;