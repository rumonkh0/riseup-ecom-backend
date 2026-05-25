import { Router } from 'express';
import * as reviewsController from './reviews.controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createReviewSchema, updateReviewSchema } from '../../validators/review.validator.js';
import { idParamSchema } from '../../validators/common.validator.js';
import { z } from 'zod';

const productIdSchema = z.object({ productId: z.string().uuid() });

const router = Router();

router.get(
  '/product/:productId',
  validate(productIdSchema, 'params'),
  reviewsController.getProductReviews
);

router.use(protect);

router.post('/', validate(createReviewSchema), reviewsController.addReview);
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateReviewSchema),
  reviewsController.updateReview
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  reviewsController.deleteReview
);

export default router;
