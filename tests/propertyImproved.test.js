const request = require('supertest');
const app = require('../app');

describe('propertyImproved API', () => {
  let createdId;
  const payload = {
  "PIN": 1
};

  test('POST /propertyImproved → should create item', async () => {
    const res = await request(app).post('/propertyImproved').send(payload);
    if (res.statusCode !== 201) {
      console.error('❌ POST failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    createdId = res.body.ID;
  });

  test('GET /propertyImproved → should return array', async () => {
    const res = await request(app).get('/propertyImproved');
    if (res.statusCode !== 200) {
      console.error('❌ GET all failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /propertyImproved/:id → should return item', async () => {
    const res = await request(app).get(`/propertyImproved/${createdId}`);
    if (res.statusCode !== 200) {
      console.error('❌ GET by ID failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID');
  });

  test('PUT /propertyImproved/:id → should update item', async () => {
    const res = await request(app).put(`/propertyImproved/${createdId}`).send(payload);
    if (res.statusCode !== 200) {
      console.error('❌ PUT failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /propertyImproved/:id → should delete item', async () => {
    const res = await request(app).delete(`/propertyImproved/${createdId}`);
    if (res.statusCode !== 204) {
      console.error('❌ DELETE failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(204);
  });
});