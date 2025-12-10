const request = require('supertest');
const app = require('../app');

describe('paymentTerms API', () => {
  let createdId;
  const payload = {};

  test('POST /paymentTerms → should create item', async () => {
    const res = await request(app).post('/paymentTerms').send(payload);
    if (res.statusCode !== 201) {
      console.error('❌ POST failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    createdId = res.body.ID;
  });

  test('GET /paymentTerms → should return array', async () => {
    const res = await request(app).get('/paymentTerms');
    if (res.statusCode !== 200) {
      console.error('❌ GET all failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /paymentTerms/:id → should return item', async () => {
    const res = await request(app).get(`/paymentTerms/${createdId}`);
    if (res.statusCode !== 200) {
      console.error('❌ GET by ID failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID');
  });

  test('PUT /paymentTerms/:id → should update item', async () => {
    const res = await request(app).put(`/paymentTerms/${createdId}`).send(payload);
    if (res.statusCode !== 200) {
      console.error('❌ PUT failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /paymentTerms/:id → should delete item', async () => {
    const res = await request(app).delete(`/paymentTerms/${createdId}`);
    if (res.statusCode !== 204) {
      console.error('❌ DELETE failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(204);
  });
});