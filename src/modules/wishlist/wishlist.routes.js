import { Router } from 'express';
import * as wishlistController from './wishlist.controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const addSchema = z.object({ productId: z.string().uuid() });
const productIdParam = z.object({ productId: z.string().uuid() });

const router = Router();

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/', validate(addSchema), wishlistController.addToWishlist);
router.delete(
  '/:productId',
  validate(productIdParam, 'params'),
  wishlistController.removeFromWishlist
);

export default router;
