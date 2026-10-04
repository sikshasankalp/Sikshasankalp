import { z } from 'zod';

const booleanInput = z
  .union([
    z.boolean(),
    z.enum(['true', 'false'])
  ])
  .transform(
    (value) =>
      value === true || value === 'true'
  )
  .optional();

const optionalText = (
  min: number,
  max: number
) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .optional();

export const createMediaSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .optional(),

    publication: z
      .string()
      .trim()
      .min(2)
      .max(150)
      .optional(),

    description: optionalText(1, 1000),

    thumbnailUrl: z
      .string()
      .trim()
      .url()
      .max(2048)
      .optional(),

    externalUrl: z
      .string()
      .trim()
      .url()
      .max(2048),

    category: optionalText(1, 100),

    displayLocation: optionalText(1, 100),

    publishedAt: z
      .coerce
      .date()
      .optional(),

    isFeatured: booleanInput,

    isPublished: booleanInput
  })
  .strict();

export const updateMediaSchema =
  createMediaSchema.partial().strict();

export const mediaIdSchema = z
  .object({
    id: z.string().uuid()
  })
  .strict();

export const mediaQuerySchema = z
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

    category: z
      .string()
      .trim()
      .max(100)
      .optional(),

    displayLocation: z
      .string()
      .trim()
      .max(100)
      .optional(),

    featured: booleanInput,

    published: booleanInput
  })
  .strict();

export type CreateMediaInput =
  z.infer<typeof createMediaSchema>;

export type UpdateMediaInput =
  z.infer<typeof updateMediaSchema>;

export type MediaQueryInput =
  z.infer<typeof mediaQuerySchema>;