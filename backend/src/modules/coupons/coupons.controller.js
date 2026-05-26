import * as couponsService from './coupons.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/apiResponse.js';

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponsService.createCoupon(req.body);
  sendCreated(res, 'Coupon created', coupon);
});

export const getCoupons = asyncHandler(async (req, res) => {
  const { coupons, meta } = await couponsService.getCoupons(req.query);
  sendSuccess(res, { message: 'Coupons retrieved', data: coupons, meta });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const result = await couponsService.validateAndCalculateDiscount(
    req.body.code,
    req.body.subtotal
  );
  sendSuccess(res, { message: 'Coupon is valid', data: result });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponsService.updateCoupon(req.params.id, req.body);
  sendSuccess(res, { message: 'Coupon updated', data: coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await couponsService.deleteCoupon(req.params.id);
  sendNoContent(res);
});
