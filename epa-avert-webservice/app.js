'use strict';

const Raven = require('raven');
const Koa = require('koa');
const cors = require('@koa/cors');
const auth = require('koa-basic-auth');
const serve = require('koa-static');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const routes = require('./app/routes');
const basicAuth = require('./app/middleware/basicAuth');
const pageNotFound = require('./app/middleware/pageNotFound');
const customHeaders = require('./app/middleware/customHeaders');

// initialize Sentry Raven client
Raven.config('https://69c78678304f4e7da08b0da748eafeb9@sentry.io/1203469').install();

const app = new Koa();

// setup initial middleware
app.use(logger());
app.use(cors());
app.use(bodyParser({ jsonLimit: '50mb' }));
app.use(customHeaders);

// setup routes
routes.forEach(route => app.use(route));

// conditionally apply basic auth to downstream middleware
if (process.env.AVERT_AUTH === 'true') {
  app.use(basicAuth);
  app.use(auth({ name: process.env.AVERT_USER, pass: process.env.AVERT_PASS }));
}

// setup serving of static files and custom 404
app.use(serve('./app/public'));
app.use(pageNotFound);

// configure port and start server
app.port = process.env.PORT || 3001;

if (!module.parent) app.listen(app.port, () => {
  console.log(`Koa is running on http://localhost:${app.port}`);
});

module.exports = app;
