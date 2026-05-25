import { z } from 'zod';
import { ROLES } from '../constants/index.js';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional().nullable(),
});

export const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().min(5),
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().optional(),
  zipCode: z.string().min(3),
  country: z.string().default('US'),
  isDefault: z.boolean().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum([ROLES.USER, ROLES.ADMIN, ROLES.VENDOR]),
});
