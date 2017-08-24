const route = require('koa-route');
const jobs = require('../modules/jobs');

const app = [
    route.get('/',function* () {
        if (this.req.checkContinue) this.res.writeContinue();

        this.body = 'Service is running...';
    }),
    route.get('/api/v1/jobs/process/:id', jobs.process),
];

module.exports = app;