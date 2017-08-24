const app = require('./../app');
const request = require('supertest').agent(app.listen());

describe('Root path', () => {
    it('should say "Service is running..."', (done) => {
        request.get('/').expect(200).expect('Service is running...',done);
    });
});