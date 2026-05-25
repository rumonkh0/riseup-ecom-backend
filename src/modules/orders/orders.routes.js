import { Router } from 'express';
import * as ordersController from './orders.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../constants/index.js';
import { createOrderSchema, updateOrderStatusSchema } from '../../validators/order.validator.js';
import { idParamSchema } from '../../validators/common.validator.js';

const router = Router();

router.use(protect);

router.post('/', validate(createOrderSchema), ordersController.createOrder);
router.get('/my', ordersController.getMyOrders);

router.get('/manage/all', authorize(ROLES.ADMIN), ordersController.adminListOrders);
router.patch(
  '/manage/:id/status',
  authorize(ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateOrderStatusSchema),
  ordersController.updateOrderStatus
);

router.get('/:id', validate(idParamSchema, 'params'), ordersController.getOrder);
router.patch('/:id/cancel', validate(idParamSchema, 'params'), ordersController.cancelOrder);

export default router;
