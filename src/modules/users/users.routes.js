import { Router } from 'express';
import * as usersController from './users.controller.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../../constants/index.js';
import {
  updateProfileSchema,
  addressSchema,
  updateUserRoleSchema,
} from '../../validators/user.validator.js';
import { idParamSchema } from '../../validators/common.validator.js';
import { uploadSingle, handleMulterError } from '../../middleware/upload.js';

const router = Router();

router.use(protect);

router.patch('/profile', validate(updateProfileSchema), usersController.updateProfile);
router.patch(
  '/avatar',
  uploadSingle,
  handleMulterError,
  usersController.updateAvatar
);

router.get('/addresses', usersController.getAddresses);
router.post('/addresses', validate(addressSchema), usersController.addAddress);
router.patch(
  '/addresses/:id',
  validate(idParamSchema, 'params'),
  validate(addressSchema.partial()),
  usersController.updateAddress
);
router.delete(
  '/addresses/:id',
  validate(idParamSchema, 'params'),
  usersController.deleteAddress
);

router.get('/', authorize(ROLES.ADMIN), usersController.listUsers);
router.get('/:id', authorize(ROLES.ADMIN), validate(idParamSchema, 'params'), usersController.getUser);
router.patch(
  '/:id/role',
  authorize(ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateUserRoleSchema),
  usersController.updateUserRole
);
router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  usersController.deleteUser
);

export default router;
