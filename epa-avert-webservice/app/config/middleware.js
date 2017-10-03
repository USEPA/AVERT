const logger = require('koa-logger');
const cors = require('koa-cors');
const json = require('koa-json');
const pageNotFound = require('../lib/pageNotFound');

const middleware = [
  logger(),
  cors(),
  json(),
  pageNotFound,
];

module.exports = middleware;
