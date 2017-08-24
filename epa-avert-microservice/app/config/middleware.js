const logger = require('koa-logger');
const json = require('koa-json');
const cors = require('koa-cors');
const errorHandler = require('../lib/errorHandler');
const middleware = [
    logger(),
    errorHandler,
    cors(),
    json(),
];

module.exports = middleware;