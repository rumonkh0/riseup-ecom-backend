import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';

const recalculateProductRatings = async (productId, tx = prisma) => {
  const stats = await tx.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      ratingsAverage: stats._avg.rating ?? 0,
      ratingsQuantity: stats._count.rating,
    },
  });
};

export const addReview = async (userId, data) => {
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product) throw new AppError('Product not found.', 404);

  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId: data.productId,
      order: { userId, orderStatus: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] } },
    },
  });

  if (!purchased) {
    throw new AppError('You can only review products you have purchased.', 403);
  }

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: { userId, ...data },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
    await recalculateProductRatings(data.productId, tx);
    return created;
  });

  return review;
};

export const updateReview = async (userId, reviewId, data) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError('Review not found.', 404);
  if (review.userId !== userId) throw new AppError('Not authorized.', 403);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.review.update({
      where: { id: reviewId },
      data,
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    await recalculateProductRatings(review.productId, tx);
    return updated;
  });
};

export const deleteReview = async (userId, reviewId, isAdmin = false) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError('Review not found.', 404);
  if (!isAdmin && review.userId !== userId) {
    throw new AppError('Not authorized.', 403);
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    await recalculateProductRatings(review.productId, tx);
  });
};

export const getProductReviews = async (productId, query) => {
  const { page, limit, skip } = parsePagination(query);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return { reviews, meta: buildPaginationMeta({ page, limit, total }) };
};
