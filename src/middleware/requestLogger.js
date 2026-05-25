import morgan from 'morgan';
import logger from '../config/logger.js';
import { config } from '../config/index.js';

const stream = {
  write: (message) => logger.http(message.trim()),
};

export const requestLogger =
  config.env === 'development'
    ? morgan('dev', { stream })
    : morgan('combined', { stream });
