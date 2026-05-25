import * as reviewsService from './reviews.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/apiResponse.js';
import { ROLES } from '../../constants/index.js';

export const addReview = asyncHandler(async (req, res) => {
  const review = await reviewsService.addReview(req.user.id, req.body);
  sendCreated(res, 'Review added', review);
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewsService.updateReview(
    req.user.id,
    req.params.id,
    req.body
  );
  sendSuccess(res, { message: 'Review updated', data: review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === ROLES.ADMIN;
  await reviewsService.deleteReview(req.user.id, req.params.id, isAdmin);
  sendNoContent(res);
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { reviews, meta } = await reviewsService.getProductReviews(
    req.params.productId,
    req.query
  );
  sendSuccess(res, { message: 'Reviews retrieved', data: reviews, meta });
});
