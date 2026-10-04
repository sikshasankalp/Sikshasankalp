import { z } from 'zod';
import { GalleryCategory } from '@prisma/client';

const queryBoolean = z
  .union([
    z.boolean(),
    z.enum(['true', 'false'])
  ])
  .transform((value) => {
    if (typeof value === 'boolean') {
      return value;
    }

    return value === 'true';
  })
  .optional();

const categorySchema = z
  .nativeEnum(GalleryCategory)
  .optional();

const displayLocationSchema = z
  .string()
  .trim()
  .max(100)
  .optional();

const eventDateSchema = z
  .coerce
  .date()
  .optional();

export const createGallerySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(150),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    category: categorySchema,

    displayLocation:
      displayLocationSchema,

    eventDate:
      eventDateSchema,

    isFeatured:
      queryBoolean,

    isPublished:
      queryBoolean
  })
  .strict();

export const updateGallerySchema =
  createGallerySchema
    .partial()
    .strict();

export const galleryIdSchema = z
  .object({
    id: z.string().uuid()
  })
  .strict();

export const galleryQuerySchema = z
  .object({
    page: z
      .coerce
      .number()
      .int()
      .positive()
      .default(1),

    limit: z
      .coerce
      .number()
      .int()
      .positive()
      .max(50)
      .default(12),

    category:
      z
        .nativeEnum(GalleryCategory)
        .optional(),

    displayLocation:
      z
        .string()
        .trim()
        .max(100)
        .optional(),

    featured:
      queryBoolean,

    published:
      queryBoolean
  })
  .strict();

export type CreateGalleryInput =
  z.infer<typeof createGallerySchema>;

export type UpdateGalleryInput =
  z.infer<typeof updateGallerySchema>;

export type GalleryQueryInput =
  z.infer<typeof galleryQuerySchema>;