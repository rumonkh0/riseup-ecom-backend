import prisma from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/token.js';

const extractToken = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError('Not authorized. Please log in.', 401);
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AppError('Invalid or expired token. Please log in again.', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User no longer exists.', 401);
  }

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isVerified: true },
    });
    if (user) req.user = user;
  } catch {
    // ignore invalid token for optional auth
  }
  next();
});
