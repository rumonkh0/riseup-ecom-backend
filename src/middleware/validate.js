import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    const data = schema.parse(req[source]);
    req[source] = data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(new AppError('Validation failed', 400, errors));
    }
    next(error);
  }
};
