import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { createSlug } from '../../utils/slug.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import { uploadImage } from '../../services/cloudinary.service.js';

export const createBrand = async (data, file) => {
  const slug = createSlug(data.name);
  let logo;
  if (file) {
    const uploaded = await uploadImage(file, 'brands');
    logo = uploaded.url;
  }
  return prisma.brand.create({ data: { name: data.name, slug, logo } });
};

export const getBrands = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const where = query.search
    ? { name: { contains: query.search } }
    : {};

  const [brands, total] = await Promise.all([
    prisma.brand.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    }),
    prisma.brand.count({ where }),
  ]);

  return { brands, meta: buildPaginationMeta({ page, limit, total }) };
};

export const getBrandBySlug = async (slug) => {
  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });
  if (!brand) throw new AppError('Brand not found.', 404);
  return brand;
};

export const updateBrand = async (id, data, file) => {
  const updateData = { ...data };
  if (data.name) updateData.slug = createSlug(data.name);
  if (file) {
    const uploaded = await uploadImage(file, 'brands');
    updateData.logo = uploaded.url;
  }
  return prisma.brand.update({ where: { id }, data: updateData });
};

export const deleteBrand = async (id) => {
  const count = await prisma.product.count({ where: { brandId: id } });
  if (count > 0) throw new AppError('Cannot delete brand with products.', 400);
  await prisma.brand.delete({ where: { id } });
};
