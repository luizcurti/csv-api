import path from 'path';
import request from 'supertest';
import type { App as AppType } from '@shared/infra/app';

const TEST_CSV_PATH = path.resolve(__dirname, '../../csv/__app_unit_test.csv');

describe('App CORS configuration', () => {
  const originalCorsOrigin = process.env.CORS_ORIGIN;
  const originalCsvPath = process.env.CSV_FILE_PATH;

  afterEach(() => {
    process.env.CORS_ORIGIN = originalCorsOrigin;
    process.env.CSV_FILE_PATH = originalCsvPath;
    jest.resetModules();
  });

  it('reflects a configured origin instead of allowing any origin', async () => {
    process.env.CORS_ORIGIN = 'https://example.com';
    process.env.CSV_FILE_PATH = TEST_CSV_PATH;
    jest.resetModules();
    const { App } = await import('@shared/infra/app');

    const app: AppType = new App();
    await app.init();

    const res = await request(app.server)
      .get('/health')
      .set('Origin', 'https://example.com');

    expect(res.headers['access-control-allow-origin']).toBe(
      'https://example.com'
    );
  });
});
