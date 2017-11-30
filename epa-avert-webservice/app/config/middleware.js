const logger = require('koa-logger');
const cors = require('koa-cors');
const json = require('koa-json');
const setHeaders = require('../lib/setHeaders');
const pageNotFound = require('../lib/pageNotFound');

const middleware = [
  logger(),
  cors(),
  json(),
  setHeaders,
  pageNotFound,
];

module.exports = middleware;
