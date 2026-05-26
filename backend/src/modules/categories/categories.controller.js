import * as categoriesService from './categories.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/apiResponse.js';

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoriesService.createCategory(req.body, req.file);
  sendCreated(res, 'Category created', category);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoriesService.getCategories(req.query);
  sendSuccess(res, { message: 'Categories retrieved', data: categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoriesService.getCategoryBySlug(req.params.slug);
  sendSuccess(res, { message: 'Category retrieved', data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoriesService.updateCategory(
    req.params.id,
    req.body,
    req.file
  );
  sendSuccess(res, { message: 'Category updated', data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoriesService.deleteCategory(req.params.id);
  sendNoContent(res);
});
