import * as ordersService from './orders.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import { ROLES } from '../../constants/index.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await ordersService.createOrder(req.user.id, req.body);
  sendCreated(res, 'Order placed successfully', order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const { orders, meta } = await ordersService.getUserOrders(req.user.id, req.query);
  sendSuccess(res, { message: 'Orders retrieved', data: orders, meta });
});

export const getOrder = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === ROLES.ADMIN;
  const order = await ordersService.getOrderById(
    req.params.id,
    req.user.id,
    isAdmin
  );
  sendSuccess(res, { message: 'Order retrieved', data: order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === ROLES.ADMIN;
  const order = await ordersService.cancelOrder(
    req.params.id,
    req.user.id,
    isAdmin
  );
  sendSuccess(res, { message: 'Order cancelled', data: order });
});

export const adminListOrders = asyncHandler(async (req, res) => {
  const { orders, meta } = await ordersService.adminListOrders(req.query);
  sendSuccess(res, { message: 'Orders retrieved', data: orders, meta });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await ordersService.updateOrderStatus(req.params.id, req.body);
  sendSuccess(res, { message: 'Order updated', data: order });
});
