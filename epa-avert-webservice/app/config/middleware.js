const logger = require('koa-logger');
const cors = require('@koa/cors');
const serve = require('koa-static');

const setHeaders = require('../lib/setHeaders');
const pageNotFound = require('../lib/pageNotFound');

const middleware = [
  setHeaders,
  logger(),
  cors(),
  serve('./app/public'),
  pageNotFound,
];

module.exports = middleware;
