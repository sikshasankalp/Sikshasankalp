import { z } from 'zod';

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

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(150)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Invalid slug format'
  );

export const createProgramSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(150),

    slug: slugSchema,

    shortDescription: z
      .string()
      .trim()
      .max(300)
      .optional(),

    description: z
      .string()
      .trim()
      .max(5000)
      .optional(),

    isFeatured:
      queryBoolean,

    isPublished:
      queryBoolean,

    displayOrder: z
      .coerce
      .number()
      .int()
      .min(0)
      .max(100000)
      .default(0)
  })
  .strict();

export const updateProgramSchema =
  createProgramSchema
    .partial()
    .strict();

export const programIdSchema = z
  .object({
    id: z.string().uuid()
  })
  .strict();

export const programQuerySchema = z
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

    featured:
      queryBoolean,

    published:
      queryBoolean
  })
  .strict();

export type CreateProgramInput =
  z.infer<typeof createProgramSchema>;

export type UpdateProgramInput =
  z.infer<typeof updateProgramSchema>;

export type ProgramQueryInput =
  z.infer<typeof programQuerySchema>;