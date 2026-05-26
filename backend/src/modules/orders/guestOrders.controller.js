import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../../utils/apiResponse.js';

const prisma = new PrismaClient();

/**
 * POST /api/v1/guest-orders
 * Public — no auth required. Creates an order for guest checkout.
 */
export const createGuestOrder = asyncHandler(async (req, res) => {
  const { name, mobile, email, address, notes, items, subtotal, shipping, total } = req.body;

  // Basic validation
  if (!name || !mobile || !address || !items || !items.length) {
    return res.status(400).json({
      success: false,
      message: 'Name, mobile, address, and at least one item are required',
    });
  }

  const order = await prisma.guestOrder.create({
    data: {
      name,
      mobile,
      email: email || null,
      address,
      notes: notes || null,
      items,
      subtotal,
      shipping,
      total,
    },
  });

  sendCreated(res, 'Order placed successfully', order);
});

/**
 * GET /api/v1/guest-orders
 * Admin — lists all guest orders (newest first).
 */
export const listGuestOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.guestOrder.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.guestOrder.count(),
  ]);

  sendSuccess(res, {
    message: 'Guest orders retrieved',
    data: orders,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

/**
 * GET /api/v1/guest-orders/:id
 * Admin — get a single guest order by ID.
 */
export const getGuestOrder = asyncHandler(async (req, res) => {
  const order = await prisma.guestOrder.findUnique({
    where: { id: req.params.id },
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  sendSuccess(res, { message: 'Guest order retrieved', data: order });
});

/**
 * PATCH /api/v1/guest-orders/:id/status
 * Admin — update order status.
 */
export const updateGuestOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const order = await prisma.guestOrder.update({
    where: { id: req.params.id },
    data: { status },
  });

  sendSuccess(res, { message: 'Order status updated', data: order });
});
