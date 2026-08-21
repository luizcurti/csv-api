import express, { Application, NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { env } from '@config/env';
import { routes } from './http/routes/index';
import { openapiSpec } from './http/docs/openapi';

class App {
  public server: Application;

  constructor() {
    this.server = express();
  }

  async init() {
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(
      cors({
        origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','),
      })
    );
    this.server.use(helmet());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());
    this.server.use(
      '/api',
      rateLimit({
        windowMs: env.rateLimit.windowMs,
        max: env.rateLimit.max,
        standardHeaders: true,
        legacyHeaders: false,
      })
    );

    console.log('[SERVER] MIDDLEWARES REGISTERED');
  }

  routes() {
    this.server.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    });

    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

    this.server.use('/api/csv', routes);

    // Global 404 handler for paths outside /api/csv
    this.server.use((_req: Request, res: Response, _next: NextFunction) => {
      res.status(404).json({ message: 'Route Not Found' });
    });

    console.log('[SERVER] ROUTES REGISTERED');
  }
}

export { App };
