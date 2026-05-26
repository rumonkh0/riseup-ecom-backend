import * as cartService from './cart.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  sendSuccess(res, { message: 'Cart retrieved', data: cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user.id, req.body);
  sendSuccess(res, { message: 'Item added to cart', data: cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItem(
    req.user.id,
    req.params.itemId,
    req.body.quantity
  );
  sendSuccess(res, { message: 'Cart item updated', data: cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user.id, req.params.itemId);
  sendSuccess(res, { message: 'Item removed from cart', data: cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  sendSuccess(res, { message: 'Cart cleared', data: cart });
});
