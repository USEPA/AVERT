const logger = require('koa-logger');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

const setHeaders = require('../lib/setHeaders');
const pageNotFound = require('../lib/pageNotFound');

let authMiddleware = [];
if (process.env.REACT_APP_AUTH === 'true') {
  const auth = require('koa-basic-auth');
  const basicAuth = require('../lib/basicAuth');

  authMiddleware = [
    basicAuth,
    auth({ name: process.env.REACT_APP_USER, pass: process.env.REACT_APP_PASS }),
  ];
}

const middleware = [
  setHeaders,
  logger(),
  cors(),
  bodyParser({ jsonLimit: '50mb' }),
  serve('./app/public'),
  pageNotFound,
];

module.exports = authMiddleware.concat(middleware);
