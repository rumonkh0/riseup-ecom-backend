import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { decimalToNumber } from '../../utils/decimal.js';

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          stock: true,
          thumbnail: true,
          isPublished: true,
        },
      },
    },
  },
};

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  return cart;
};

const computeCartTotals = (items) => {
  let subtotal = 0;
  for (const item of items) {
    if (!item.product?.isPublished) continue;
    const price = decimalToNumber(
      item.product.discountPrice ?? item.product.price
    );
    subtotal += price * item.quantity;
  }
  return { subtotal, itemCount: items.length };
};

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const totals = computeCartTotals(cart.items);
  return { ...cart, ...totals };
};

export const addToCart = async (userId, { productId, quantity }) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isPublished) {
    throw new AppError('Product not available.', 404);
  }
  if (product.stock < quantity) {
    throw new AppError('Insufficient stock.', 400);
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((i) => i.productId === productId);
  const newQty = (existingItem?.quantity || 0) + quantity;

  if (newQty > product.stock) {
    throw new AppError('Cannot add more than available stock.', 400);
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  return getCart(userId);
};

export const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new AppError('Cart item not found.', 404);

  const product = await prisma.product.findUnique({ where: { id: item.productId } });
  if (!product || product.stock < quantity) {
    throw new AppError('Insufficient stock.', 400);
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getCart(userId);
};

export const removeFromCart = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new AppError('Cart item not found.', 404);

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getCart(userId);
};
