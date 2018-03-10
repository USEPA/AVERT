const redisClient = require('../lib/redisClient');

module.exports = {
  get: async (ctx, id) => {
    // get 'job:id' key and value in 'avert' hash in redis
    const data = await redisClient.get(`job:${id}`);

    ctx.body = {
      response: (data === null) ? 'in progress' : 'ok',
      job: id,
      data: JSON.parse(data),
    };
  },
};
