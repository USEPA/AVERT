const app = require('./../app');
const request = require('supertest').agent(app.listen());

describe('Root path', () => {
  it('should say "AVERT web service is running..."', (done) => {
    request.get('/')
      .expect(200)
      .expect('AVERT web service is running...', done);
  });
});
