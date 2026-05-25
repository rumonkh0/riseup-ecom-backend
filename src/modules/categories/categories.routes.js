import { Router } from 'express';
import * as categoriesController from './categories.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../constants/index.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validators/category.validator.js';
import { idParamSchema, slugParamSchema } from '../../validators/common.validator.js';
import { uploadSingle, handleMulterError } from '../../middleware/upload.js';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/:slug', validate(slugParamSchema, 'params'), categoriesController.getCategory);

router.use(protect, authorize(ROLES.ADMIN, ROLES.VENDOR));

router.post(
  '/',
  uploadSingle,
  handleMulterError,
  validate(createCategorySchema),
  categoriesController.createCategory
);
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  uploadSingle,
  handleMulterError,
  validate(updateCategorySchema),
  categoriesController.updateCategory
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  categoriesController.deleteCategory
);

export default router;
