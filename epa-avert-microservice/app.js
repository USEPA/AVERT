'use strict';
// Framework
const koa = require('koa');
const middleware = require('./app/config/middleware');
const routes = require('./app/http/routes');
const route = require('koa-route');
const app = koa();
// const websockify = require('koa-websocket');
// const app = websockify(koa());
const port = app.port = process.env.PORT || 3001;

// App
middleware.forEach(function (middleware) {
    app.use(middleware);
});

// app.ws.use(route.all('/', function* (next) {
//     this.websocket.on('message',function(message) {
//         console.log(message);
//     });
//
//     this.websocket.send('Hello Client!');
//
//     yield next;
// }));

routes.forEach(function (route) {
    app.use(route);
});

if (!module.parent) app.listen(port, function() {
    console.log('EPA AVERT Microservice app is running on http://localhost:' + port);
});

module.exports = app;