import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import productsRoutes from '../modules/products/products.routes.js';
import categoriesRoutes from '../modules/categories/categories.routes.js';
import brandsRoutes from '../modules/brands/brands.routes.js';
import cartRoutes from '../modules/cart/cart.routes.js';
import ordersRoutes from '../modules/orders/orders.routes.js';
import couponsRoutes from '../modules/coupons/coupons.routes.js';
import reviewsRoutes from '../modules/reviews/reviews.routes.js';
import wishlistRoutes from '../modules/wishlist/wishlist.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import uploadsRoutes from './uploads.routes.js';
import guestOrdersRoutes from '../modules/orders/guestOrders.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', data: { version: 'v1' } });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/brands', brandsRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/coupons', couponsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/guest-orders', guestOrdersRoutes);

export default router;
