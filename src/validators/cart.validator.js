import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive().max(99).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive().max(99),
});
