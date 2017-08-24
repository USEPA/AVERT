const logger = require('koa-logger');
const json = require('koa-json');
const cors = require('koa-cors');
const errorHandler = require('../lib/errorHandler');
// const injectRedis = require('../lib/injectRedis');
const middleware = [
    logger(),
    errorHandler,
    cors(),
    json(),
    // injectRedis,
];

module.exports = middleware;