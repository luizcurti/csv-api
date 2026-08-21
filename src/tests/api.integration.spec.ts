import path from 'path';
import fs from 'fs';
import request from 'supertest';
import type { App as AppType } from '@shared/infra/app';

const TEST_CSV_PATH = path.resolve(
  __dirname,
  '../../csv/__integration_test_data.csv'
);

describe('CSV API (integration)', () => {
  let app: AppType;

  beforeAll(async () => {
    process.env.CSV_FILE_PATH = TEST_CSV_PATH;
    jest.resetModules();
    const { App } = await import('@shared/infra/app');
    app = new App();
    await app.init();
  });

  beforeEach(() => {
    if (fs.existsSync(TEST_CSV_PATH)) fs.unlinkSync(TEST_CSV_PATH);
  });

  afterAll(() => {
    if (fs.existsSync(TEST_CSV_PATH)) fs.unlinkSync(TEST_CSV_PATH);
  });

  it('GET /health returns ok', async () => {
    const res = await request(app.server).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /docs serves the OpenAPI UI', async () => {
    const res = await request(app.server).get('/docs/');

    expect(res.status).toBe(200);
    expect(res.type).toBe('text/html');
  });

  it('performs a full CRUD flow', async () => {
    const createRes = await request(app.server)
      .post('/api/csv')
      .send({ product_code: 'INT-001', quantity: 5, pick_location: 'A1' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.product_code).toBe('INT-001');

    const listRes = await request(app.server).get('/api/csv');
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);

    const getRes = await request(app.server).get('/api/csv/INT-001');
    expect(getRes.status).toBe(200);
    expect(getRes.body.quantity).toBe(5);

    const updateRes = await request(app.server)
      .put('/api/csv/INT-001')
      .send({ quantity: 20, pick_location: 'B2' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.quantity).toBe(20);

    const deleteRes = await request(app.server).delete('/api/csv/INT-001');
    expect(deleteRes.status).toBe(200);

    const getAfterDelete = await request(app.server).get('/api/csv/INT-001');
    expect(getAfterDelete.status).toBe(404);
  });

  it('returns 400 for an invalid payload', async () => {
    const res = await request(app.server)
      .post('/api/csv')
      .send({ product_code: '', quantity: -1, pick_location: '' });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe('VALIDATION_FAILED');
  });

  it('returns 409 when creating a duplicate product', async () => {
    await request(app.server)
      .post('/api/csv')
      .send({ product_code: 'DUP-1', quantity: 1, pick_location: 'A1' });

    const res = await request(app.server)
      .post('/api/csv')
      .send({ product_code: 'DUP-1', quantity: 1, pick_location: 'A1' });

    expect(res.status).toBe(409);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app.server).get('/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Route Not Found');
  });

  it('returns 404 for an unmatched path under /api/csv', async () => {
    const res = await request(app.server).get('/api/csv/foo/bar');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Route Not Found');
  });

  it('returns 400 for an invalid product_code path parameter', async () => {
    const res = await request(app.server).get('/api/csv/bad!code');

    expect(res.status).toBe(400);
    expect(res.body.type).toBe('VALIDATION_FAILED');
  });

  it('returns 400 for an invalid pagination query parameter', async () => {
    const res = await request(app.server).get('/api/csv?limit=not-a-number');

    expect(res.status).toBe(400);
    expect(res.body.type).toBe('VALIDATION_FAILED');
  });
});
