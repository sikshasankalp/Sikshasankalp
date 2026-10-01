import { z } from 'zod';

const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((val) => val === 'true' || val === true)
  .optional();

export const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(100),
  designation: z.string().trim().min(2).max(100),
  bio: z.string().trim().max(2000).optional(),
  photoUrl: z.string().url().max(2048).optional(),
  cloudinaryPublicId: z.string().trim().max(500).optional(),
  displayOrder: z.coerce.number().int().default(0).optional(),
  isPublished: queryBoolean,
}).strict();

export const updateTeamSchema = createTeamSchema.partial().strict();

export const teamIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const teamQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  published: queryBoolean,
}).strict();

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type TeamQueryInput = z.infer<typeof teamQuerySchema>;
