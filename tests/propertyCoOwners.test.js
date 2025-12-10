const request = require('supertest');
const app = require('../app');

describe('propertyCoOwners API', () => {
  let createdId;
  const payload = {};

  test('POST /propertyCoOwners → should create item', async () => {
    const res = await request(app).post('/propertyCoOwners').send(payload);
    if (res.statusCode !== 201) {
      console.error('❌ POST failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    createdId = res.body.ID;
  });

  test('GET /propertyCoOwners → should return array', async () => {
    const res = await request(app).get('/propertyCoOwners');
    if (res.statusCode !== 200) {
      console.error('❌ GET all failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /propertyCoOwners/:id → should return item', async () => {
    const res = await request(app).get(`/propertyCoOwners/${createdId}`);
    if (res.statusCode !== 200) {
      console.error('❌ GET by ID failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID');
  });

  test('PUT /propertyCoOwners/:id → should update item', async () => {
    const res = await request(app).put(`/propertyCoOwners/${createdId}`).send(payload);
    if (res.statusCode !== 200) {
      console.error('❌ PUT failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /propertyCoOwners/:id → should delete item', async () => {
    const res = await request(app).delete(`/propertyCoOwners/${createdId}`);
    if (res.statusCode !== 204) {
      console.error('❌ DELETE failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(204);
  });
});