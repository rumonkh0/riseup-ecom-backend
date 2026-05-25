import app from './app.js';
import { config, validateConfig } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import logger from './config/logger.js';

const startServer = async () => {
  try {
    validateConfig();
    await connectDatabase();

    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
