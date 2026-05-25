import * as productsService from './products.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/apiResponse.js';

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productsService.createProduct(
    req.body,
    req.file,
    req.files
  );
  sendCreated(res, 'Product created', product);
});

export const getProducts = asyncHandler(async (req, res) => {
  const includeUnpublished = req.user?.role === 'ADMIN' || req.user?.role === 'VENDOR';
  const { products, meta } = await productsService.getProducts(req.query, {
    includeUnpublished,
  });
  sendSuccess(res, { message: 'Products retrieved', data: products, meta });
});

export const getFeatured = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const products = await productsService.getFeaturedProducts(limit);
  sendSuccess(res, { message: 'Featured products retrieved', data: products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productsService.getProductBySlug(req.params.slug);
  sendSuccess(res, { message: 'Product retrieved', data: product });
});

export const getRelated = asyncHandler(async (req, res) => {
  const products = await productsService.getRelatedProducts(req.params.id);
  sendSuccess(res, { message: 'Related products retrieved', data: products });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productsService.updateProduct(
    req.params.id,
    req.body,
    req.file,
    req.files
  );
  sendSuccess(res, { message: 'Product updated', data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productsService.deleteProduct(req.params.id);
  sendNoContent(res);
});
