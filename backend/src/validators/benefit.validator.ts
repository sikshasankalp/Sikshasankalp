import { z } from 'zod';

export const createBenefitSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200),
  displayOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
}).strict();

export const updateBenefitSchema = createBenefitSchema.partial();

export const benefitIdSchema = z.object({
  id: z.string().uuid('Invalid benefit ID'),
}).strict();

export type CreateBenefitInput = z.infer<typeof createBenefitSchema>;
export type UpdateBenefitInput = z.infer<typeof updateBenefitSchema>;
