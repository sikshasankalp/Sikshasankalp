import { z } from 'zod';

const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((val) => val === 'true' || val === true)
  .optional();

export const createTransparencySchema = z.object({
  title: z.string().trim().min(2).max(200),
  documentType: z.string().trim().min(2).max(100),
  documentNumber: z.string().trim().max(100).optional(),
  documentUrl: z.string().url().max(2048),
  cloudinaryPublicId: z.string().trim().max(500).optional(),
  issuedDate: z.coerce.date().optional(),
  description: z.string().trim().max(2000).optional(),
  isPublished: queryBoolean,
}).strict();

export const updateTransparencySchema = createTransparencySchema.partial().strict();

export const transparencyIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const transparencyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  documentType: z.string().trim().max(100).optional(),
  published: queryBoolean,
  search: z.string().trim().max(100).optional(),
}).strict();

export type CreateTransparencyInput = z.infer<typeof createTransparencySchema>;
export type UpdateTransparencyInput = z.infer<typeof updateTransparencySchema>;
export type TransparencyQueryInput = z.infer<typeof transparencyQuerySchema>;
