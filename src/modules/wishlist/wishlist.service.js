import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';

const wishlistInclude = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discountPrice: true,
      thumbnail: true,
      ratingsAverage: true,
      stock: true,
    },
  },
};

export const getWishlist = async (userId) =>
  prisma.wishlist.findMany({
    where: { userId },
    include: wishlistInclude,
    orderBy: { createdAt: 'desc' },
  });

export const addToWishlist = async (userId, productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isPublished) {
    throw new AppError('Product not found.', 404);
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    throw new AppError('Product already in wishlist.', 409);
  }

  return prisma.wishlist.create({
    data: { userId, productId },
    include: wishlistInclude,
  });
};

export const removeFromWishlist = async (userId, productId) => {
  const item = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (!item) throw new AppError('Wishlist item not found.', 404);
  await prisma.wishlist.delete({ where: { id: item.id } });
};
