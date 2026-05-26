import { Router } from 'express';
import * as ctrl from './guestOrders.controller.js';

const router = Router();

// Public — guest checkout
router.post('/', ctrl.createGuestOrder);

// These could be admin-protected later; for now open so you can view orders easily
router.get('/', ctrl.listGuestOrders);
router.get('/:id', ctrl.getGuestOrder);
router.patch('/:id/status', ctrl.updateGuestOrderStatus);

export default router;
