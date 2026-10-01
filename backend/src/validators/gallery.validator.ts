import { z } from 'zod';

const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((val) => val === 'true' || val === true)
  .optional();

export const createGallerySchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(1000).optional(),
  imageUrl: z.string().url().max(2048),
  cloudinaryPublicId: z.string().trim().max(500).optional(),
  category: z.string().trim().min(2).max(100),
  eventDate: z.coerce.date().optional(),
  isFeatured: z.boolean().default(false).optional(),
  isPublished: z.boolean().default(false).optional(),
}).strict();

export const updateGallerySchema = createGallerySchema.partial().strict();

export const galleryIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const galleryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  category: z.string().trim().max(100).optional(),
  featured: queryBoolean,
  published: queryBoolean,
}).strict();

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
export type GalleryQueryInput = z.infer<typeof galleryQuerySchema>;
