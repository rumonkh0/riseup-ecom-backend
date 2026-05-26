import * as adminService from './admin.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const stats = await adminService.getDashboardStats();
  sendSuccess(res, { message: 'Dashboard stats retrieved', data: stats });
});

export const getSalesSummary = asyncHandler(async (req, res) => {
  const summary = await adminService.getSalesSummary(req.query.period);
  sendSuccess(res, { message: 'Sales summary retrieved', data: summary });
});
