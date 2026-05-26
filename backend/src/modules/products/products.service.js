import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { createSlug } from '../../utils/slug.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import { toDecimal } from '../../utils/decimal.js';
import { uploadImage, uploadImages } from '../../services/cloudinary.service.js';

const productSelect = {
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
  variants: true,
};

const buildProductWhere = (query) => {
  const where = {};

  if (query.isPublished !== undefined) {
    where.isPublished = query.isPublished;
  } else if (!query.includeUnpublished) {
    where.isPublished = true;
  }

  if (query.isFeatured !== undefined) where.isFeatured = query.isFeatured;
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.brandId) where.brandId = query.brandId;

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { description: { contains: query.search } },
      { sku: { contains: query.search } },
    ];
  }

  return where;
};

const buildProductOrderBy = (sort) => {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'rating':
      return { ratingsAverage: 'desc' };
    case 'sold':
      return { soldCount: 'desc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
};

export const createProduct = async (data, thumbnailFile, imageFiles) => {
  const slug = createSlug(data.name);
  const skuExists = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (skuExists) throw new AppError('SKU already exists.', 409);

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new AppError('Category not found.', 404);

  if (data.brandId) {
    const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
    if (!brand) throw new AppError('Brand not found.', 404);
  }

  let thumbnail;
  if (thumbnailFile) {
    const uploaded = await uploadImage(thumbnailFile, 'products');
    thumbnail = uploaded.url;
  }

  let images = [];
  if (imageFiles?.length) {
    const uploaded = await uploadImages(imageFiles, 'products');
    images = uploaded.map((u) => u.url);
  }

  return prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      shortDescription: data.shortDescription,
      price: toDecimal(data.price),
      discountPrice: data.discountPrice != null ? toDecimal(data.discountPrice) : null,
      stock: data.stock,
      sku: data.sku,
      barcode: data.barcode,
      thumbnail,
      images,
      categoryId: data.categoryId,
      brandId: data.brandId || null,
      isFeatured: data.isFeatured ?? false,
      isPublished: data.isPublished ?? true,
    },
    include: productSelect,
  });
};

export const getProducts = async (query, { includeUnpublished = false } = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const where = buildProductWhere({ ...query, includeUnpublished });
  const orderBy = buildProductOrderBy(query.sort);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: productSelect,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, meta: buildPaginationMeta({ page, limit, total }) };
};

export const getFeaturedProducts = async (limit = 10) => {
  return prisma.product.findMany({
    where: { isFeatured: true, isPublished: true },
    take: limit,
    orderBy: { soldCount: 'desc' },
    include: productSelect,
  });
};

export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productSelect,
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  });
  if (!product) throw new AppError('Product not found.', 404);
  return product;
};

export const getRelatedProducts = async (productId, limit = 8) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true },
  });
  if (!product) throw new AppError('Product not found.', 404);

  return prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId },
      isPublished: true,
    },
    take: limit,
    orderBy: { ratingsAverage: 'desc' },
    include: productSelect,
  });
};

export const updateProduct = async (id, data, thumbnailFile, imageFiles) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Product not found.', 404);

  const updateData = { ...data };
  if (data.name) updateData.slug = createSlug(data.name);
  if (data.price !== undefined) updateData.price = toDecimal(data.price);
  if (data.discountPrice !== undefined) {
    updateData.discountPrice =
      data.discountPrice != null ? toDecimal(data.discountPrice) : null;
  }

  if (thumbnailFile) {
    const uploaded = await uploadImage(thumbnailFile, 'products');
    updateData.thumbnail = uploaded.url;
  }

  if (imageFiles?.length) {
    const uploaded = await uploadImages(imageFiles, 'products');
    const newUrls = uploaded.map((u) => u.url);
    const currentImages = Array.isArray(existing.images) ? existing.images : [];
    updateData.images = [...currentImages, ...newUrls];
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: productSelect,
  });
};

export const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id } });
};
