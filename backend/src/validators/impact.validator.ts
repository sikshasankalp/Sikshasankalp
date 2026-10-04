import { z } from 'zod';

export const createImpactMetricSchema = z.object({
  value: z.coerce.number().int().nonnegative(),
  label: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  displayOrder: z.coerce.number().int().nonnegative().optional().default(0),
  isPublished: z.union([z.boolean(), z.enum(['true', 'false'])]).transform((val) => val === 'true' || val === true).optional().default(true),
}).strict();

export const updateImpactMetricSchema = createImpactMetricSchema.partial().strict();

export const impactMetricIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export type CreateImpactMetricInput = z.infer<typeof createImpactMetricSchema>;
export type UpdateImpactMetricInput = z.infer<typeof updateImpactMetricSchema>;
