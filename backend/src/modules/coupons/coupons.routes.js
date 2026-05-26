import { Router } from 'express';
import * as couponsController from './coupons.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../constants/index.js';
import {
  createCouponSchema,
  updateCouponSchema,
  applyCouponSchema,
} from '../../validators/coupon.validator.js';
import { idParamSchema } from '../../validators/common.validator.js';

const router = Router();

router.post('/validate', protect, validate(applyCouponSchema), couponsController.validateCoupon);

router.use(protect, authorize(ROLES.ADMIN));

router.get('/', couponsController.getCoupons);
router.post('/', validate(createCouponSchema), couponsController.createCoupon);
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateCouponSchema),
  couponsController.updateCoupon
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  couponsController.deleteCoupon
);

export default router;
