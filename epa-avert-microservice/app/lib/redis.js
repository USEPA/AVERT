const Redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
const coRedis = require('co-redis');
const config = require('../config/redis');
const db = Redis.createClient(config.port,config.hostname);
db.auth(config.password);

const dbCo = coRedis(db);

db.on('error', function (err) {
    console.error('error','node-redis','lib/redis.js',err);
});

module.exports = {
    incr: function* (key) {
        return dbCo.incr(key);
    },
    set: function* (key, value) {
        return dbCo.hset('avert',key, value);
    },
    get: function* (key) {
        return dbCo.hget('avert',key);
    },
    del: function* (key) {
        return dbCo.hdel('avert',key);
    },
};
