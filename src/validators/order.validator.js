import { z } from 'zod';
import { ORDER_STATUS } from '../constants/index.js';

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(5),
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().optional(),
    zipCode: z.string().min(3),
    country: z.string().default('US'),
  }),
  paymentMethod: z.string().min(1),
  couponCode: z.string().optional(),
  tax: z.coerce.number().nonnegative().optional(),
  shippingFee: z.coerce.number().nonnegative().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1)
    .optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.RETURNED,
  ]),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  transactionId: z.string().optional(),
});
