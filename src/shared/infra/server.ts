import { App } from './app';

(async () => {
  const app = new App();
  await app.init();

  const port = process.env.PORT || 3005;

  app.server.listen(port, () => {
    console.log(`[SERVER] LISTENING ON PORT ${port}`);
  });
})();