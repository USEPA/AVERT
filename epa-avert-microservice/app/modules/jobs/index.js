const redisClient = require('../../lib/redis');

module.exports = {
  get: function* (id) {
    // get 'job:id' key and value in 'avert' hash in redis
    const data = yield redisClient.get(`job:${id}`);

    // return response, job id, and data (used by web app)
    this.body = {
      response: (data === null) ? 'in progress' : 'ok',
      job: id,
      data: JSON.parse(data),
    };
  },
};
