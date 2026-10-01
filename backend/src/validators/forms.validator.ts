import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(1),
  mobile: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  enquiryType: z.string(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export const volunteerSchema = z.object({
  name: z.string().min(1),
  mobile: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
  skills: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().optional(),
});

export const partnerEnquirySchema = z.object({
  organisationName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  mobile: z.string().min(10),
  organisationType: z.string().optional(),
  city: z.string().optional(),
  areaOfInterest: z.string().optional(),
  message: z.string().optional(),
});
