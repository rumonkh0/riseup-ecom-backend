import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().max(2000).optional(),
});

export const updateReviewSchema = createReviewSchema
  .omit({ productId: true })
  .partial();
