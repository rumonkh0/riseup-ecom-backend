import prisma from '../../config/database.js';
import { PAYMENT_STATUS } from '../../constants/index.js';
import { decimalToNumber } from '../../utils/decimal.js';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalOrders,
    paidOrders,
    revenueAgg,
    recentOrders,
    topProducts,
    ordersByStatus,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: PAYMENT_STATUS.PAID } }),
    prisma.order.aggregate({
      where: { paymentStatus: PAYMENT_STATUS.PAID },
      _sum: { totalPrice: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { take: 3 },
      },
    }),
    prisma.product.findMany({
      take: 10,
      orderBy: { soldCount: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        soldCount: true,
        price: true,
        thumbnail: true,
        ratingsAverage: true,
      },
    }),
    prisma.order.groupBy({
      by: ['orderStatus'],
      _count: { orderStatus: true },
    }),
  ]);

  const totalRevenue = decimalToNumber(revenueAgg._sum.totalPrice ?? 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueByDay = await prisma.$queryRaw`
    SELECT DATE(createdAt) as date, SUM(totalPrice) as revenue, COUNT(*) as orders
    FROM orders
    WHERE paymentStatus = 'PAID' AND createdAt >= ${thirtyDaysAgo}
    GROUP BY DATE(createdAt)
    ORDER BY date ASC
  `;

  return {
    totalUsers,
    totalOrders,
    paidOrders,
    totalSales: totalRevenue,
    totalRevenue,
    recentOrders,
    topProducts,
    ordersByStatus,
    revenueAnalytics: revenueByDay,
  };
};

export const getSalesSummary = async (period = '30d') => {
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [orders, revenue] = await Promise.all([
    prisma.order.count({
      where: { createdAt: { gte: since }, paymentStatus: PAYMENT_STATUS.PAID },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: since }, paymentStatus: PAYMENT_STATUS.PAID },
      _sum: { totalPrice: true },
    }),
  ]);

  return {
    period,
    orders,
    revenue: decimalToNumber(revenue._sum.totalPrice ?? 0),
  };
};
