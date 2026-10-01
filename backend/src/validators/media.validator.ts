import { z } from 'zod';

const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((val) => val === 'true' || val === true)
  .optional();

export const createMediaSchema = z.object({
  title: z.string().trim().min(2).max(200),
  publication: z.string().trim().min(2).max(150),
  description: z.string().trim().max(1000).optional(),
  thumbnailUrl: z.string().url().max(2048).optional(),
  cloudinaryPublicId: z.string().trim().max(500).optional(),
  externalUrl: z.string().url().max(2048),
  publishedAt: z.coerce.date().optional(),
  isFeatured: queryBoolean,
  isPublished: queryBoolean,
}).strict();

export const updateMediaSchema = createMediaSchema.partial().strict();

export const mediaIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const mediaQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  featured: queryBoolean,
  published: queryBoolean,
}).strict();

export type CreateMediaInput = z.infer<typeof createMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
export type MediaQueryInput = z.infer<typeof mediaQuerySchema>;
