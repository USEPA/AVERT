const app = require('./../app');
const request = require('supertest').agent(app.listen());

describe('API path', () => {
  it('should say "AVERT web service is running..."', (done) => {
    request.get('/api/v1')
      .expect(200)
      .expect('AVERT web service is running...', done);
  });
});
