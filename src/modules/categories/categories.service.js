import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { createSlug } from '../../utils/slug.js';
import { uploadImage } from '../../services/cloudinary.service.js';

const categoryInclude = {
  children: true,
  _count: { select: { products: true } },
};

export const createCategory = async (data, file) => {
  const slug = createSlug(data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new AppError('Category slug already exists.', 409);

  if (data.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
    if (!parent) throw new AppError('Parent category not found.', 404);
  }

  let image;
  if (file) {
    const uploaded = await uploadImage(file, 'categories');
    image = uploaded.url;
  }

  return prisma.category.create({
    data: { name: data.name, slug, parentId: data.parentId || null, image },
    include: categoryInclude,
  });
};

export const getCategories = async ({ parentId, tree } = {}) => {
  if (tree === 'true' || tree === true) {
    const roots = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
    return roots;
  }

  const where = {};
  if (parentId === 'null' || parentId === null) where.parentId = null;
  else if (parentId) where.parentId = parentId;

  return prisma.category.findMany({
    where,
    include: categoryInclude,
    orderBy: { name: 'asc' },
  });
};

export const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } },
    },
  });
  if (!category) throw new AppError('Category not found.', 404);
  return category;
};

export const updateCategory = async (id, data, file) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError('Category not found.', 404);

  const updateData = { ...data };
  if (data.name) updateData.slug = createSlug(data.name);

  if (data.parentId) {
    if (data.parentId === id) {
      throw new AppError('Category cannot be its own parent.', 400);
    }
    const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
    if (!parent) throw new AppError('Parent category not found.', 404);
  }

  if (file) {
    const uploaded = await uploadImage(file, 'categories');
    updateData.image = uploaded.url;
  }

  return prisma.category.update({
    where: { id },
    data: updateData,
    include: categoryInclude,
  });
};

export const deleteCategory = async (id) => {
  const children = await prisma.category.count({ where: { parentId: id } });
  if (children > 0) {
    throw new AppError('Cannot delete category with subcategories.', 400);
  }
  const products = await prisma.product.count({ where: { categoryId: id } });
  if (products > 0) {
    throw new AppError('Cannot delete category with products.', 400);
  }
  await prisma.category.delete({ where: { id } });
};
