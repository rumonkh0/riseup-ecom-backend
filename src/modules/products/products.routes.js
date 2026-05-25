import { Router } from 'express';
import * as productsController from './products.controller.js';
import { protect, optionalAuth } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../constants/index.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../../validators/product.validator.js';
import { idParamSchema, slugParamSchema } from '../../validators/common.validator.js';
import { uploadSingle, uploadMultiple, handleMulterError } from '../../middleware/upload.js';

const router = Router();

router.get('/featured', productsController.getFeatured);
router.get(
  '/',
  optionalAuth,
  validate(productQuerySchema, 'query'),
  productsController.getProducts
);
router.get(
  '/id/:id/related',
  validate(idParamSchema, 'params'),
  productsController.getRelated
);
router.get(
  '/:slug',
  validate(slugParamSchema, 'params'),
  productsController.getProduct
);

router.use(protect, authorize(ROLES.ADMIN, ROLES.VENDOR));

router.post(
  '/',
  uploadSingle,
  handleMulterError,
  validate(createProductSchema),
  productsController.createProduct
);
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  uploadSingle,
  handleMulterError,
  validate(updateProductSchema),
  productsController.updateProduct
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  productsController.deleteProduct
);

export default router;
