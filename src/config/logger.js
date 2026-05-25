import fs from 'fs';
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.resolve(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

if (config.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    })
  );
}

export default logger;
