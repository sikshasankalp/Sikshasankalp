import { z } from 'zod';

export const createNeedSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200),
  category: z.string().trim().max(100).optional(),
  quantity: z.string().trim().max(100).optional(),
  urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  description: z.string().trim().max(1000).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
}).strict();

export const updateNeedSchema = createNeedSchema.partial();

export const needIdSchema = z.object({
  id: z.string().uuid('Invalid need ID'),
}).strict();

export const needQuerySchema = z.object({
  isActive: z.enum(['true', 'false']).optional(),
  category: z.string().trim().optional(),
  urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  search: z.string().trim().optional(),
}).strict();

export type CreateNeedInput = z.infer<typeof createNeedSchema>;
export type UpdateNeedInput = z.infer<typeof updateNeedSchema>;
export type NeedQueryInput = z.infer<typeof needQuerySchema>;
