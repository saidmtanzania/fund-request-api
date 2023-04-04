import app from '../src/App';
import request from 'supertest';

let server: any;

beforeAll((done) => {
  server = app.listen(3000, () => {
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
