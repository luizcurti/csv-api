import { env } from '@config/env';
import { logger } from '@shared/utils/logger';
import { App } from './app';

(async () => {
  const app = new App();
  await app.init();

  const server = app.server.listen(env.port, () => {
    console.log(`[SERVER] LISTENING ON PORT ${env.port}`);
  });

  const shutdown = (signal: string) => {
    logger.info('Shutdown signal received, closing server', { signal });
    server.close(() => {
      logger.info('Server closed gracefully');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
})();
