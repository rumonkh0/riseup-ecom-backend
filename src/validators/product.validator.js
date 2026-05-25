import { z } from 'zod';

const decimalField = z.coerce.number().nonnegative();

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  shortDescription: z.string().max(500).optional(),
  price: decimalField,
  discountPrice: decimalField.optional().nullable(),
  stock: z.coerce.number().int().nonnegative(),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  isFeatured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  isPublished: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'rating', 'sold'])
    .optional(),
});
