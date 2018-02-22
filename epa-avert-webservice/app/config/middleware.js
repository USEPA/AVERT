const logger = require('koa-logger');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

const setHeaders = require('../lib/setHeaders');
const pageNotFound = require('../lib/pageNotFound');

const middleware = [
  setHeaders,
  logger(),
  cors(),
  bodyParser({ jsonLimit: '50mb' }),
  serve('./app/public'),
  pageNotFound,
];

module.exports = middleware;
