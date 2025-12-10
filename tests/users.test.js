const request = require('supertest');
const app = require('../app');

describe('users API', () => {
  let createdId;
  const payload = {
  "UserName": null,
  "Password": null,
  "UserAccessID": 1,
  "Active": 1,
  "CreatedBy": null,
  "CreatedDate": "2025-06-14T07:01:17.816Z"
};

  test('POST /users → should create item', async () => {
    const res = await request(app).post('/users').send(payload);
    if (res.statusCode !== 201) {
      console.error('❌ POST failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    createdId = res.body.ID;
  });

  test('GET /users → should return array', async () => {
    const res = await request(app).get('/users');
    if (res.statusCode !== 200) {
      console.error('❌ GET all failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /users/:id → should return item', async () => {
    const res = await request(app).get(`/users/${createdId}`);
    if (res.statusCode !== 200) {
      console.error('❌ GET by ID failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID');
  });

  test('PUT /users/:id → should update item', async () => {
    const res = await request(app).put(`/users/${createdId}`).send(payload);
    if (res.statusCode !== 200) {
      console.error('❌ PUT failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /users/:id → should delete item', async () => {
    const res = await request(app).delete(`/users/${createdId}`);
    if (res.statusCode !== 204) {
      console.error('❌ DELETE failed:', res.statusCode);
      console.error('❌ Response body:', res.body);
    }
    expect(res.statusCode).toBe(204);
  });
});