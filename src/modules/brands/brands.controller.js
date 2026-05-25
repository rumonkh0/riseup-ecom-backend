import * as brandsService from './brands.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/apiResponse.js';

export const createBrand = asyncHandler(async (req, res) => {
  const brand = await brandsService.createBrand(req.body, req.file);
  sendCreated(res, 'Brand created', brand);
});

export const getBrands = asyncHandler(async (req, res) => {
  const { brands, meta } = await brandsService.getBrands(req.query);
  sendSuccess(res, { message: 'Brands retrieved', data: brands, meta });
});

export const getBrand = asyncHandler(async (req, res) => {
  const brand = await brandsService.getBrandBySlug(req.params.slug);
  sendSuccess(res, { message: 'Brand retrieved', data: brand });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await brandsService.updateBrand(req.params.id, req.body, req.file);
  sendSuccess(res, { message: 'Brand updated', data: brand });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  await brandsService.deleteBrand(req.params.id);
  sendNoContent(res);
});
