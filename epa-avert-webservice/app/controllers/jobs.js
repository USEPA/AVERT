const redisClient = require('../lib/redisClient');

module.exports = {
  get: async (ctx, id) => {
    // get 'job:id' value in 'avert' hash in redis
    const data = await redisClient.get(`job:${id}`);

    // if 'job:id' key doesn't exist in 'avert' hash in redis, return error
    if (data === null) {
      ctx.body = { response: 'error' }
      return;
    }

    // else, data has been processed, so return data
    ctx.body = {
      response: 'ok',
      data: JSON.parse(data),
    }

    console.log(`Redis: ${id} data retrieved`);

    // remove 'job:id' key and value in 'avert' hash in redis
    redisClient.del(`job:${id}`);
  },
};
