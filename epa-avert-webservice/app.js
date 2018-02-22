'use strict';

const Koa = require('koa');
const middleware = require('./app/config/middleware');
const routes = require('./app/routes');

const app = new Koa();

middleware.forEach((middleware) => app.use(middleware));

routes.forEach((route) => app.use(route));

app.port = process.env.PORT || 3001;

if (!module.parent) app.listen(app.port, () => {
  console.log(`Koa is running on http://localhost:${app.port}`);
});

module.exports = app;
