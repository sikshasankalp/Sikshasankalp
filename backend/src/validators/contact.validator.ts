import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150).optional().or(z.literal('')),
  mobile: z.string().trim().min(10).max(15),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(2).max(2000),
}).strict();

export const updateContactSchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'CLOSED'])
}).strict();

export const contactIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const contactQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  status: z.enum(['NEW', 'READ', 'REPLIED', 'CLOSED']).optional(),
  search: z.string().trim().max(100).optional(),
}).strict();

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactQueryInput = z.infer<typeof contactQuerySchema>;
