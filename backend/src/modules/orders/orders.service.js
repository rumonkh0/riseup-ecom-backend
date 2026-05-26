import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { toDecimal, decimalToNumber } from '../../utils/decimal.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import {
  CANCELLABLE_ORDER_STATUSES,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from '../../constants/index.js';
import { validateAndCalculateDiscount } from '../coupons/coupons.service.js';

const orderInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, slug: true, thumbnail: true } },
    },
  },
  user: { select: { id: true, name: true, email: true } },
};

const getEffectivePrice = (product) =>
  product.discountPrice ?? product.price;

const buildLineItems = async (itemsInput) => {
  const lineItems = [];

  for (const { productId, quantity } of itemsInput) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isPublished) {
      throw new AppError(`Product ${productId} is not available.`, 400);
    }
    if (product.stock < quantity) {
      throw new AppError(`Insufficient stock for ${product.name}.`, 400);
    }

    const unitPrice = getEffectivePrice(product);
    lineItems.push({
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity,
      image: product.thumbnail,
      stockToDeduct: quantity,
    });
  }

  return lineItems;
};

const calculateSubtotal = (lineItems) =>
  lineItems.reduce(
    (sum, item) => sum.add(item.price.mul(item.quantity)),
    toDecimal(0)
  );

export const createOrder = async (userId, data) => {
  let itemsInput = data.items;

  if (!itemsInput?.length) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart?.items?.length) {
      throw new AppError('Cart is empty. Add items before placing an order.', 400);
    }
    itemsInput = cart.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    }));
  }

  const lineItems = await buildLineItems(itemsInput);
  let subtotal = calculateSubtotal(lineItems);
  let discount = toDecimal(0);
  let couponCode = null;

  if (data.couponCode) {
    const couponResult = await validateAndCalculateDiscount(
      data.couponCode,
      decimalToNumber(subtotal)
    );
    discount = toDecimal(couponResult.discount);
    couponCode = couponResult.coupon.code;
  }

  const tax = toDecimal(data.tax ?? 0);
  const shippingFee = toDecimal(data.shippingFee ?? 0);
  const totalPrice = subtotal.add(tax).add(shippingFee).sub(discount);

  if (totalPrice.lessThan(0)) {
    throw new AppError('Invalid order total.', 400);
  }

  const order = await prisma.$transaction(async (tx) => {
    for (const item of lineItems) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.stockToDeduct },
        },
        data: {
          stock: { decrement: item.stockToDeduct },
          soldCount: { increment: item.stockToDeduct },
        },
      });

      if (updated.count === 0) {
        throw new AppError(`Insufficient stock for ${item.name}.`, 400);
      }
    }

    const created = await tx.order.create({
      data: {
        userId,
        subtotal,
        tax,
        shippingFee,
        discount,
        totalPrice,
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        couponCode,
        paymentStatus: PAYMENT_STATUS.PENDING,
        orderStatus: ORDER_STATUS.PENDING,
        items: {
          create: lineItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
      include: orderInclude,
    });

    if (couponCode) {
      await tx.coupon.update({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    const cart = await tx.cart.findUnique({ where: { userId } });
    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return created;
  });

  return order;
};

export const getUserOrders = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const where = { userId };
  if (query.orderStatus) where.orderStatus = query.orderStatus;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, meta: buildPaginationMeta({ page, limit, total }) };
};

export const getOrderById = async (orderId, userId, isAdmin = false) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order) throw new AppError('Order not found.', 404);
  if (!isAdmin && order.userId !== userId) {
    throw new AppError('Not authorized to view this order.', 403);
  }

  return order;
};

export const cancelOrder = async (orderId, userId, isAdmin = false) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new AppError('Order not found.', 404);
  if (!isAdmin && order.userId !== userId) {
    throw new AppError('Not authorized to cancel this order.', 403);
  }

  if (!CANCELLABLE_ORDER_STATUSES.includes(order.orderStatus)) {
    throw new AppError('Order cannot be cancelled at this stage.', 400);
  }

  return prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity },
          soldCount: { decrement: item.quantity },
        },
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: { orderStatus: ORDER_STATUS.CANCELLED },
      include: orderInclude,
    });
  });
};

export const adminListOrders = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const where = {};
  if (query.orderStatus) where.orderStatus = query.orderStatus;
  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
  if (query.userId) where.userId = query.userId;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, meta: buildPaginationMeta({ page, limit, total }) };
};

export const updateOrderStatus = async (orderId, data) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found.', 404);

  const updateData = { orderStatus: data.orderStatus };
  if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
  if (data.transactionId) updateData.transactionId = data.transactionId;

  if (data.paymentStatus === PAYMENT_STATUS.PAID && !order.paidAt) {
    updateData.paidAt = new Date();
  }
  if (data.orderStatus === ORDER_STATUS.DELIVERED) {
    updateData.deliveredAt = new Date();
  }

  return prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: orderInclude,
  });
};
