const DisplacementsEngine = require('./DisplacementsEngine');
const parse = require('co-body');
const request = require('koa-request');
const redis = require('../../lib/redis');
const displacementJobs = require('../jobs/addDisplacementJob');

// const workerUrl = 'https://avert-microservice-workers.cfapps.io/api/v1/jobs/process/';
const workerUrl = 'https://avert-workers.app.cloud.gov/api/v1/jobs/process/';

// Controller
const DisplacementsController = {

    calculateGeneration: function* calculateGeneration() {
        const json = yield parse.json(this, { limit: '50mb' });
        const id = yield redis.incr('job');
        yield redis.set('generation:eere:' + id,JSON.stringify(json.eere));
        displacementJobs.addGenerationJob(id,json.region);

        const options = {
            url: workerUrl + 'calculate_generation',
            headers: { 'User-Agent': 'request' },
        };

        const response = yield request(options);

        this.body = {
            response: 'OK',
            job: id,
        }
    },

    calculateSo2: function* calculateSo2() {
        const json = yield parse.json(this, { limit: '50mb' });
        const id = yield redis.incr('job');
        yield redis.set('so2:eere:' + id,JSON.stringify(json.eere));
        displacementJobs.addSo2Job(id,json.region);

        const options = {
            url: workerUrl + 'calculate_so2',
            headers: { 'User-Agent': 'request' },
        };

        const response = yield request(options);

        this.body = {
            response: 'OK',
            job: id,
        }
    },

    calculateNox: function* calculateNox() {
        const json = yield parse.json(this, { limit: '50mb' });
        const id = yield redis.incr('job');
        yield redis.set('nox:eere:' + id,JSON.stringify(json.eere));
        displacementJobs.addNoxJob(id,json.region);

        const options = {
            url: workerUrl + 'calculate_nox',
            headers: { 'User-Agent': 'request' },
        };

        const response = yield request(options);

        this.body = {
            response: 'OK',
            job: id,
        }
    },

    calculateCo2: function* calculateCo2() {
        const json = yield parse.json(this, { limit: '50mb' });
        const id = yield redis.incr('job');
        yield redis.set('co2:eere:' + id,JSON.stringify(json.eere));
        displacementJobs.addCo2Job(id,json.region);

        const options = {
            url: workerUrl + 'calculate_co2',
            headers: { 'User-Agent': 'request' },
        };

        const response = yield request(options);

        this.body = {
            response: 'OK',
            job: id,
        }
    }
};

module.exports = DisplacementsController;
