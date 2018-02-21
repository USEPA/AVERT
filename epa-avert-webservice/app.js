'use strict';

const Koa = require('koa');
const middleware = require('./app/config/middleware');
const routes = require('./app/routes');

const app = new Koa();
const port = app.port = process.env.PORT || 3001;

middleware.forEach(function (middleware) {
  app.use(middleware);
});

routes.forEach(function (route) {
  app.use(route);
});

if (!module.parent) app.listen(port, function() {
  console.log(`EPA AVERT Microservice app is running on http://localhost:${port}`);
});

module.exports = app;
