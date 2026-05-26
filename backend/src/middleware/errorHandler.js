import { Prisma } from '@prisma/client';
import { config } from '../config/index.js';
import logger from '../config/logger.js';
import { AppError } from '../utils/AppError.js';

const handlePrismaError = (err) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      return new AppError(`Duplicate value for ${field}.`, 409);
    }
    if (err.code === 'P2025') {
      return new AppError('Resource not found.', 404);
    }
    if (err.code === 'P2003') {
      return new AppError('Related resource not found.', 400);
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return new AppError('Invalid data sent to database.', 400);
  }
  return err;
};

export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, _req, res, _next) => {
  let error = handlePrismaError(err);

  if (!(error instanceof AppError)) {
    if (error.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token.', 401);
    } else if (error.name === 'TokenExpiredError') {
      error = new AppError('Token expired.', 401);
    } else {
      error = new AppError(error.message || 'Internal server error', 500);
    }
  }

  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(error.stack || error.message);
  }

  const payload = {
    success: false,
    message: error.message,
  };

  if (error.errors) payload.errors = error.errors;

  if (config.env === 'development' && statusCode >= 500) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
