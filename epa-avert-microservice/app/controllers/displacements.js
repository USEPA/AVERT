const parse = require('co-body');
const request = require('koa-request');

const redisClient = require('../lib/redis');
const addJobToQueue = require('../modules/jobs/addJobToQueue');
const processJobFromQueue = require('../modules/jobs/processJobFromQueue');

const maxFileSize = '50mb';
const workerUrl = 'https://avert-workers.app.cloud.gov/api/v1/jobs/process';



module.exports = {
  calculateGeneration: function* () {
    const body = yield parse.json(this, { limit: maxFileSize });
    // increment 'job' string in redis
    const id = yield redisClient.incr('job');
    // set/update 'generation:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`generation:eere:${id}`, JSON.stringify(body.eere));
    // add generation job to queue
    addJobToQueue.addGenerationJob(id, body.region);

    // process generation job from queue
    processJobFromQueue.calculateGeneration();

    // // send request to worker app
    // yield request({
    //   url: `${workerUrl}/calculate_generation`,
    //   headers: { 'User-Agent': 'request' },
    // });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    }
  },

  calculateSo2: function* () {
    const body = yield parse.json(this, { limit: maxFileSize });
    // increment 'job' string in redis
    const id = yield redisClient.incr('job');
    // set/update 'so2:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`so2:eere:${id}`, JSON.stringify(body.eere));
    // add so2 job to queue
    addJobToQueue.addSo2Job(id, body.region);

    // process so2 job from queue
    processJobFromQueue.calculateSo2();

    // // send request to worker app
    // yield request({
    //   url: `${workerUrl}/calculate_so2`,
    //   headers: { 'User-Agent': 'request' },
    // });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    }
  },

  calculateNox: function* () {
    const body = yield parse.json(this, { limit: maxFileSize });
    // increment 'job' string in redis
    const id = yield redisClient.incr('job');
    // set/update 'nox:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`nox:eere:${id}`, JSON.stringify(body.eere));
    // add nox job to queue
    addJobToQueue.addNoxJob(id, body.region);

    // process nox job from queue
    processJobFromQueue.calculateNox();

    // // send request to worker app
    // yield request({
    //   url: `${workerUrl}/calculate_nox`,
    //   headers: { 'User-Agent': 'request' },
    // });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    }
  },

  calculateCo2: function* () {
    const body = yield parse.json(this, { limit: maxFileSize });
    // increment 'job' string in redis
    const id = yield redisClient.incr('job');
    // set/update 'co2:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`co2:eere:${id}`, JSON.stringify(body.eere));
    // add co2 job to queue
    addJobToQueue.addCo2Job(id, body.region);

    // process co2 job from queue
    processJobFromQueue.calculateCo2();

    // // send request to worker app
    // yield request({
    //   url: `${workerUrl}/calculate_co2`,
    //   headers: { 'User-Agent': 'request' },
    // });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    }
  },
};
