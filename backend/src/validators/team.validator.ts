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

const optionalUrl = z
  .string()
  .trim()
  .url()
  .max(2048)
  .optional();


const displayOrderSchema = z
  .coerce
  .number()
  .int()
  .min(0)
  .max(100000)
  .default(0);

export const createTeamSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100),

    designation: z
      .string()
      .trim()
      .min(2)
      .max(100),

    bio: z
      .string()
      .trim()
      .max(2000)
      .optional(),

    responsibilities: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    expertise: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    department: z
      .string()
      .trim()
      .max(100)
      .optional(),

    photoUrl: optionalUrl,

    displayOrder: displayOrderSchema,

    isActive: queryBoolean,

    isPublished: queryBoolean
  })
  .strict();

export const updateTeamSchema =
  createTeamSchema
    .partial()
    .strict();

export const teamIdSchema = z
  .object({
    id: z.string().uuid()
  })
  .strict();

export const teamQuerySchema = z
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

    published: queryBoolean
  })
  .strict();

export type CreateTeamInput =
  z.infer<typeof createTeamSchema>;

export type UpdateTeamInput =
  z.infer<typeof updateTeamSchema>;

export type TeamQueryInput =
  z.infer<typeof teamQuerySchema>;