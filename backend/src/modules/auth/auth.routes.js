import { Router } from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
} from '../../validators/auth.validator.js';

const router = Router();

router.use(authLimiter);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', protect, validate(changePasswordSchema), authController.changePassword);
router.post('/resend-verification', protect, authController.resendVerification);
router.get('/me', protect, authController.getMe);

export default router;
