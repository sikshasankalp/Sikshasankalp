import { z } from 'zod';

export const createPartnerSchema = z.object({
  organizationName: z.string().trim().min(2).max(150),
  contactPerson: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  mobile: z.string().trim().min(10).max(15),
  organizationType: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
}).strict();

export const updatePartnerSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'])
}).strict();

export const partnerIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const partnerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']).optional(),
  organizationType: z.string().trim().max(100).optional(),
  search: z.string().trim().max(100).optional(),
}).strict();

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
export type PartnerQueryInput = z.infer<typeof partnerQuerySchema>;
