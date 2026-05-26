import { AppError } from '../utils/AppError.js';

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Not authorized.', 401));
  }
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission for this action.', 403));
  }
  next();
};
