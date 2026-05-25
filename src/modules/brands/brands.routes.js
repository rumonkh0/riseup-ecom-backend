import { Router } from 'express';
import * as brandsController from './brands.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../constants/index.js';
import { createBrandSchema, updateBrandSchema } from '../../validators/brand.validator.js';
import { idParamSchema, slugParamSchema } from '../../validators/common.validator.js';
import { uploadSingle, handleMulterError } from '../../middleware/upload.js';

const router = Router();

router.get('/', brandsController.getBrands);
router.get('/:slug', validate(slugParamSchema, 'params'), brandsController.getBrand);

router.use(protect, authorize(ROLES.ADMIN, ROLES.VENDOR));

router.post(
  '/',
  uploadSingle,
  handleMulterError,
  validate(createBrandSchema),
  brandsController.createBrand
);
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  uploadSingle,
  handleMulterError,
  validate(updateBrandSchema),
  brandsController.updateBrand
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  brandsController.deleteBrand
);

export default router;
