import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sanitizeRequestData } from './utils/sanitize.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { swaggerServe, swaggerSetup } from './config/swagger.js';

const app = express();

app.set('trust proxy', 1);

app.use('/api/v1/docs', swaggerServe, swaggerSetup);

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return cb(null, true);
      const allowed = [config.clientUrl, 'http://localhost:3001', 'http://localhost:3000'];
      if (allowed.includes(origin) || origin.endsWith('.ngrok-free.dev')) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: true,
  })
);
app.use(compression());
app.use(hpp());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(sanitizeRequestData);
app.use(requestLogger);

app.use('/api/v1', apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
