import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(2).max(100),
});

export const updateBrandSchema = createBrandSchema.partial();
