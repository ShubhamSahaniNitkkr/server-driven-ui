import express from 'express';
import cors from 'cors';
import path from 'node:path';
import authRoutes from './routes/auth.routes.js';
import configRoutes from './routes/config.routes.js';
import schemaRoutes from './routes/schema.routes.js';
import dataRoutes from './routes/data.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config/index.js';

const defaultCorsOrigins = ['http://localhost:4321', 'http://localhost:3000'];
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : defaultCorsOrigins;

export function createApp() {
  const app = express();

  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json());

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/config', configRoutes);
  app.use('/api/v1/schemas', schemaRoutes);
  app.use('/api/v1/data', dataRoutes);

  if (config.serveStatic) {
    app.use(express.static(config.staticWebPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        next();
        return;
      }
      res.sendFile(path.join(config.staticWebPath, 'index.html'));
    });
  }

  app.use(errorHandler);

  return app;
}
