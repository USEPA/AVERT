const logger = require('koa-logger');
const cors = require('koa-cors');
const json = require('koa-json');
const serve = require('koa-static');

const setHeaders = require('../lib/setHeaders');
const pageNotFound = require('../lib/pageNotFound');

const middleware = [
  setHeaders,
  logger(),
  cors(),
  json(),
  serve('./app/public'),
  pageNotFound,
];

module.exports = middleware;
