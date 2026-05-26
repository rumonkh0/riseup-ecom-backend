import * as wishlistService from './wishlist.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/apiResponse.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const items = await wishlistService.getWishlist(req.user.id);
  sendSuccess(res, { message: 'Wishlist retrieved', data: items });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const item = await wishlistService.addToWishlist(req.user.id, req.body.productId);
  sendCreated(res, 'Added to wishlist', item);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
  sendNoContent(res);
});
