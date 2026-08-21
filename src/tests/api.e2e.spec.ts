import fs from 'fs';
import path from 'path';
import request from 'supertest';

/**
 * Black-box E2E suite: makes real HTTP requests over the network against a
 * server that must already be running (e.g. `docker compose up`), as
 * opposed to the in-process integration suite. Run with `npm run test:e2e`.
 */
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3005';
const DATA_CSV_PATH = path.resolve(__dirname, '../../csv/data.csv');

describe('CSV API (e2e)', () => {
  let originalCsvContent: string | null = null;

  beforeAll(() => {
    if (fs.existsSync(DATA_CSV_PATH)) {
      originalCsvContent = fs.readFileSync(DATA_CSV_PATH, 'utf-8');
    }
  });

  afterAll(() => {
    // The API writes through to the CSV file mounted into the container;
    // restore the original seed data regardless of how the tests went.
    if (originalCsvContent !== null) {
      fs.writeFileSync(DATA_CSV_PATH, originalCsvContent);
    }
  });

  it('GET /health reports the service is up', async () => {
    const res = await request(BASE_URL).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('GET /docs serves the Swagger UI', async () => {
    const res = await request(BASE_URL).get('/docs/');

    expect(res.status).toBe(200);
    expect(res.type).toBe('text/html');
  });

  describe('happy path: full CRUD lifecycle', () => {
    const productCode = `E2E-${Date.now()}`;

    it('creates the product', async () => {
      const res = await request(BASE_URL)
        .post('/api/csv')
        .send({ product_code: productCode, quantity: 5, pick_location: 'A1' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        product_code: productCode,
        quantity: 5,
        pick_location: 'A1',
      });
    });

    it('lists the product', async () => {
      const res = await request(BASE_URL).get('/api/csv');

      expect(res.status).toBe(200);
      expect(
        res.body.data.some(
          (item: { product_code: string }) => item.product_code === productCode
        )
      ).toBe(true);
    });

    it('fetches the product by code', async () => {
      const res = await request(BASE_URL).get(`/api/csv/${productCode}`);

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(5);
    });

    it('updates the product', async () => {
      const res = await request(BASE_URL)
        .put(`/api/csv/${productCode}`)
        .send({ quantity: 42, pick_location: 'B2' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        product_code: productCode,
        quantity: 42,
        pick_location: 'B2',
      });
    });

    it('deletes the product', async () => {
      const res = await request(BASE_URL).delete(`/api/csv/${productCode}`);

      expect(res.status).toBe(200);
    });

    it('confirms the product no longer exists', async () => {
      const res = await request(BASE_URL).get(`/api/csv/${productCode}`);

      expect(res.status).toBe(404);
    });
  });

  describe('sad paths', () => {
    it('rejects an invalid payload with 400', async () => {
      const res = await request(BASE_URL)
        .post('/api/csv')
        .send({ product_code: '', quantity: -1, pick_location: '' });

      expect(res.status).toBe(400);
      expect(res.body.type).toBe('VALIDATION_FAILED');
    });

    it('rejects an invalid path parameter with 400', async () => {
      const res = await request(BASE_URL).get('/api/csv/bad!code');

      expect(res.status).toBe(400);
    });

    it('rejects an invalid query parameter with 400', async () => {
      const res = await request(BASE_URL).get('/api/csv?limit=not-a-number');

      expect(res.status).toBe(400);
    });

    it('rejects a duplicate product with 409', async () => {
      const productCode = `E2E-DUP-${Date.now()}`;

      await request(BASE_URL)
        .post('/api/csv')
        .send({ product_code: productCode, quantity: 1, pick_location: 'A1' });

      const res = await request(BASE_URL)
        .post('/api/csv')
        .send({ product_code: productCode, quantity: 1, pick_location: 'A1' });

      expect(res.status).toBe(409);

      await request(BASE_URL).delete(`/api/csv/${productCode}`);
    });

    it('returns 404 for a non-existent product on update', async () => {
      const res = await request(BASE_URL)
        .put('/api/csv/DOES-NOT-EXIST')
        .send({ quantity: 1, pick_location: 'A1' });

      expect(res.status).toBe(404);
    });

    it('returns 404 for a non-existent product on delete', async () => {
      const res = await request(BASE_URL).delete('/api/csv/DOES-NOT-EXIST');

      expect(res.status).toBe(404);
    });

    it('returns 404 for an unknown route', async () => {
      const res = await request(BASE_URL).get('/unknown-route');

      expect(res.status).toBe(404);
    });

    it('never leaks a stack trace to the client', async () => {
      const res = await request(BASE_URL).get('/api/csv/DOES-NOT-EXIST');

      expect(res.body.errorStack).toBeUndefined();
    });
  });
});
