import { PrismaClient } from '@prisma/client';
import { config } from './index.js';
import logger from './logger.js';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      config.env === 'development'
        ? [{ emit: 'event', level: 'query' }, 'error', 'warn']
        : ['error'],
  });

if (config.env === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query} — ${e.duration}ms`);
  });
}

if (config.env !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const connectDatabase = async () => {
  await prisma.$connect();
  logger.info('MySQL connected via Prisma');
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};

export default prisma;
