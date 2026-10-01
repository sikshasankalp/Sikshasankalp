import { z } from 'zod';

export const createVolunteerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().min(10).max(15),
  email: z.string().trim().email().max(100).optional().or(z.literal('')),
  city: z.string().trim().max(100).optional(),
  skills: z.string().trim().max(500).optional(),
  interests: z.string().trim().max(500).optional(),
  message: z.string().trim().max(2000).optional(),
}).strict();

export const updateVolunteerSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'])
}).strict();

export const volunteerIdSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const volunteerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']).optional(),
  city: z.string().trim().max(100).optional(),
  search: z.string().trim().max(100).optional(),
}).strict();

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>;
export type UpdateVolunteerInput = z.infer<typeof updateVolunteerSchema>;
export type VolunteerQueryInput = z.infer<typeof volunteerQuerySchema>;
