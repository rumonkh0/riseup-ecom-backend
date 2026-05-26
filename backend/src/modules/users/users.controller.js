import * as usersService from './users.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/apiResponse.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await usersService.updateProfile(req.user.id, req.body);
  sendSuccess(res, { message: 'Profile updated', data: user });
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const user = await usersService.updateAvatar(req.user.id, req.file);
  sendSuccess(res, { message: 'Avatar updated', data: user });
});

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await usersService.getAddresses(req.user.id);
  sendSuccess(res, { message: 'Addresses retrieved', data: addresses });
});

export const addAddress = asyncHandler(async (req, res) => {
  const address = await usersService.addAddress(req.user.id, req.body);
  sendCreated(res, 'Address added', address);
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await usersService.updateAddress(
    req.user.id,
    req.params.id,
    req.body
  );
  sendSuccess(res, { message: 'Address updated', data: address });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await usersService.deleteAddress(req.user.id, req.params.id);
  sendNoContent(res);
});

export const listUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await usersService.listUsers(req.query);
  sendSuccess(res, { message: 'Users retrieved', data: users, meta });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  sendSuccess(res, { message: 'User retrieved', data: user });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await usersService.updateUserRole(req.params.id, req.body.role);
  sendSuccess(res, { message: 'User role updated', data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await usersService.deleteUser(req.params.id);
  sendNoContent(res);
});
