import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { toDecimal, decimalToNumber } from '../../utils/decimal.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import { DISCOUNT_TYPE } from '../../constants/index.js';

export const createCoupon = async (data) =>
  prisma.coupon.create({
    data: {
      ...data,
      code: data.code.toUpperCase(),
      discountValue: toDecimal(data.discountValue),
      minOrderValue: data.minOrderValue != null ? toDecimal(data.minOrderValue) : null,
      maxDiscount: data.maxDiscount != null ? toDecimal(data.maxDiscount) : null,
    },
  });

export const getCoupons = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const where = query.isActive !== undefined ? { isActive: query.isActive === 'true' } : {};

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.coupon.count({ where }),
  ]);

  return { coupons, meta: buildPaginationMeta({ page, limit, total }) };
};

export const validateAndCalculateDiscount = async (code, subtotal) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    throw new AppError('Invalid coupon code.', 400);
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    throw new AppError('Coupon is not yet active.', 400);
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    throw new AppError('Coupon has expired.', 400);
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached.', 400);
  }

  const subtotalDec = toDecimal(subtotal);
  if (coupon.minOrderValue && subtotalDec.lessThan(coupon.minOrderValue)) {
    throw new AppError(
      `Minimum order value is ${decimalToNumber(coupon.minOrderValue)}.`,
      400
    );
  }

  let discount;
  if (coupon.discountType === DISCOUNT_TYPE.PERCENTAGE) {
    discount = subtotalDec.mul(coupon.discountValue).div(100);
    if (coupon.maxDiscount && discount.greaterThan(coupon.maxDiscount)) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  if (discount.greaterThan(subtotalDec)) {
    discount = subtotalDec;
  }

  return { coupon, discount: decimalToNumber(discount) };
};

export const updateCoupon = async (id, data) => {
  const updateData = { ...data };
  if (data.discountValue !== undefined) updateData.discountValue = toDecimal(data.discountValue);
  if (data.minOrderValue !== undefined) {
    updateData.minOrderValue =
      data.minOrderValue != null ? toDecimal(data.minOrderValue) : null;
  }
  if (data.maxDiscount !== undefined) {
    updateData.maxDiscount =
      data.maxDiscount != null ? toDecimal(data.maxDiscount) : null;
  }
  return prisma.coupon.update({ where: { id }, data: updateData });
};

export const deleteCoupon = async (id) => {
  await prisma.coupon.delete({ where: { id } });
};