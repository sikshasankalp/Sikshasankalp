import { z } from 'zod';

const libraryCategories = [
  'NCERT_BOOK',
  'NOTES',
  'STUDY_MATERIAL',
  'EDUCATIONAL_VIDEO',
  'PDF',
  'DIGITAL_LEARNING',
  'COMPETITIVE_EXAM',
  'OTHER',
] as const;

const queryBoolean = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((value) =>
    typeof value === 'boolean' ? value : value === 'true',
  )
  .optional();

const categorySchema = z.enum(libraryCategories);

const fileUrlSchema = z
  .string()
  .trim()
  .url()
  .max(2048);

const fileTypeSchema = z
  .string()
  .trim()
  .min(1)
  .max(100);

const fileSizeSchema = z
  .coerce
  .number()
  .int()
  .nonnegative()
  .max(100 * 1024 * 1024);

export const createLibrarySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200),

    description: z
      .string()
      .trim()
      .max(2000)
      .optional(),

    category: categorySchema.optional(),

    fileUrl: fileUrlSchema,

    fileType: fileTypeSchema.optional(),

    fileSize: fileSizeSchema.optional(),

    isPublished: queryBoolean,
  })
  .strict();

export const updateLibrarySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000)
      .optional(),

    category: categorySchema.optional(),

    fileUrl: fileUrlSchema.optional(),

    fileType: fileTypeSchema.optional(),

    fileSize: fileSizeSchema.optional(),

    isPublished: queryBoolean,
  })
  .strict();

export const libraryIdSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export const libraryQuerySchema = z
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

    category: categorySchema.optional(),

    published: queryBoolean,

    search: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),
  })
  .strict();

export type CreateLibraryInput = z.infer<
  typeof createLibrarySchema
>;

export type UpdateLibraryInput = z.infer<
  typeof updateLibrarySchema
>;

export type LibraryQueryInput = z.infer<
  typeof libraryQuerySchema
>;