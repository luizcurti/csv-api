import express, { Application, NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import helmet from 'helmet';
import cors from 'cors';

import { routes } from './http/routes/index';

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
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());

    console.log('[SERVER] MIDDLEWARES REGISTERED');
  }

  routes() {
    this.server.use('/api/csv', routes);

    // Global 404 handler for paths outside /api/csv
    this.server.use((_req: Request, res: Response, _next: NextFunction) => {
      res.status(404).json({ message: 'Route Not Found' });
    });

    console.log('[SERVER] ROUTES REGISTERED');
  }
}

export { App };
