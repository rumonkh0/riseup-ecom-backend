import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { addToCartSchema, updateCartItemSchema } from '../../validators/cart.validator.js';
import { z } from 'zod';

const itemIdSchema = z.object({ itemId: z.string().uuid() });

const router = Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/', validate(addToCartSchema), cartController.addToCart);
router.patch(
  '/items/:itemId',
  validate(itemIdSchema, 'params'),
  validate(updateCartItemSchema),
  cartController.updateCartItem
);
router.delete(
  '/items/:itemId',
  validate(itemIdSchema, 'params'),
  cartController.removeFromCart
);
router.delete('/', cartController.clearCart);

export default router;
