import { z } from 'zod';

const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((val) => val === 'true' || val === true)
  .optional();

export const createProgramSchema = z.object({
  title: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  shortDescription: z.string().trim().max(300).optional(),
  description: z.string().trim().max(5000).optional(),
  imageUrl: z.string().url().max(2048).optional(),
  cloudinaryPublicId: z.string().trim().max(500).optional(),
  isFeatured: queryBoolean,
  isPublished: queryBoolean,
  displayOrder: z.coerce.number().int().default(0).optional(),
}).strict();

export const updateProgramSchema = createProgramSchema.partial().strict();

export const programIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const programQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  featured: queryBoolean,
  published: queryBoolean,
}).strict();

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ProgramQueryInput = z.infer<typeof programQuerySchema>;
