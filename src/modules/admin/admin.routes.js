import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roles.js';
import { ROLES } from '../../constants/index.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', adminController.getDashboard);
router.get('/sales', adminController.getSalesSummary);

export default router;
