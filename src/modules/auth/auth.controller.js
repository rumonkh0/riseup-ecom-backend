import * as authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/apiResponse.js';
import { clearTokenCookie, sendTokenCookie } from '../../utils/cookie.js';

export const register = asyncHandler(async (req, res) => {
  const { token, user } = await authService.register(req.body);
  sendTokenCookie(res, token);
  sendCreated(res, 'Registration successful', { user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  sendTokenCookie(res, token);
  sendSuccess(res, { message: 'Login successful', data: { user, token } });
});

export const logout = asyncHandler(async (_req, res) => {
  clearTokenCookie(res);
  sendSuccess(res, { message: 'Logged out successfully' });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body.token);
  sendSuccess(res, { message: result.message });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  sendSuccess(res, { message: result.message });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, user } = await authService.resetPassword(req.body);
  sendTokenCookie(res, token);
  sendSuccess(res, {
    message: 'Password reset successful',
    data: { user, token },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user.id, req.body);
  sendSuccess(res, { message: result.message });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const result = await authService.resendVerification(req.user.id);
  sendSuccess(res, { message: result.message });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  sendSuccess(res, { message: 'Profile retrieved', data: user });
});
