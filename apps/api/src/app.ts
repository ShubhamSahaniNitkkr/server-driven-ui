import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import configRoutes from './routes/config.routes.js';
import schemaRoutes from './routes/schema.routes.js';
import dataRoutes from './routes/data.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: ['http://localhost:4321', 'http://localhost:3000'], credentials: true }));
  app.use(express.json());

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/config', configRoutes);
  app.use('/api/v1/schemas', schemaRoutes);
  app.use('/api/v1/data', dataRoutes);

  app.use(errorHandler);

  return app;
}
