import { z } from 'zod';

const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((val) => val === 'true' || val === true)
  .optional();

export const createLibrarySchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  category: z.enum([
    'NCERT_BOOK',
    'NOTES',
    'STUDY_MATERIAL',
    'EDUCATIONAL_VIDEO',
    'PDF',
    'DIGITAL_LEARNING',
    'COMPETITIVE_EXAM',
    'OTHER'
  ]).optional(),
  fileUrl: z.string().url().max(2048),
  cloudinaryPublicId: z.string().trim().max(500).optional(),
  thumbnailUrl: z.string().url().max(2048).optional(),
  fileType: z.string().trim().max(100).optional(),
  fileSize: z.coerce.number().int().nonnegative().optional(),
  isPublished: queryBoolean,
}).strict();

export const updateLibrarySchema = createLibrarySchema.partial().strict();

export const libraryIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const libraryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  category: z.string().trim().max(100).optional(),
  published: queryBoolean,
  search: z.string().trim().max(100).optional(),
}).strict();

export type CreateLibraryInput = z.infer<typeof createLibrarySchema>;
export type UpdateLibraryInput = z.infer<typeof updateLibrarySchema>;
export type LibraryQueryInput = z.infer<typeof libraryQuerySchema>;
