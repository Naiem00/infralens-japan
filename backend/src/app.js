import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(
    cors({
      origin: env.frontendOrigin,
    })
  );

  app.use(express.json({ limit: '1mb' }));

  app.get('/api', (_req, res) => {
    res.json({
      name: 'InfraLens Japan API',
      version: '0.1.0',
    });
  });

  app.use('/api/health', healthRoutes);
  app.use('/api/assessments', assessmentRoutes);
  app.use('/api/auth', authRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
