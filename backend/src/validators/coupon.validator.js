import { z } from 'zod';
import { DISCOUNT_TYPE } from '../constants/index.js';

export const createCouponSchema = z.object({
  code: z.string().min(3).max(30).transform((v) => v.toUpperCase()),
  description: z.string().optional(),
  discountType: z.enum([DISCOUNT_TYPE.PERCENTAGE, DISCOUNT_TYPE.FIXED]),
  discountValue: z.coerce.number().positive(),
  minOrderValue: z.coerce.number().nonnegative().optional(),
  maxDiscount: z.coerce.number().nonnegative().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();

export const applyCouponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.coerce.number().nonnegative(),
});
