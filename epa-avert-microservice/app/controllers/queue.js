const co = require('co');
const parse = require('co-body');
const request = require('koa-request');
const kue = require('kue');
const Redis = require('redis');
const bluebird = require('bluebird');

const redisConfig = require('../config/redis');
const redisClient = require('../lib/redis');

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

// --- setup redis
const db = Redis.createClient(redisConfig.port, redisConfig.hostname);
// provide authentication when connecting to cloud foundry redis service
if (process.env.WEB_SERVICE !== 'local') {
  db.auth(redisConfig.password);
}

db.on('error', function (err) {
  console.log('error', 'node-redis', 'queue', err);
});

// --- setup queue
const queue = kue.createQueue({
  redis: {
    port: redisConfig.port,
    host: redisConfig.hostname,
    auth: redisConfig.password,
  }
});

// --- display kue dashboard (local development only)
if (process.env.WEB_SERVICE === 'local') {
  kue.app.listen(3002, function() {
    console.log('Kue is running on http://localhost:3002');
  });
}



const processJobFromQueue = require('../modules/jobs/processJobFromQueue');
const workerUrl = 'https://avert-workers.app.cloud.gov/api/v1/jobs/process';



module.exports = {
  addGeneration: function* () {
    const body = yield parse.json(this, { limit: '50mb' });

    // increment 'job' string in redis
    const id = yield redisClient.incr('job');

    // set/update 'generation:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`generation:eere:${id}`, JSON.stringify(body.eere));

    // add generation job to queue
    const job = queue.create('calculate_generation', {
      title: `Calculate Generation for '${body.region}' region`,
      jobId: id,
      region: body.region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${id} (Generation) is complete`);
        // remove 'generation:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`generation:eere:${id}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${id} (Generation) has failed`);
        // remove 'generation:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`generation:eere:${id}`);
        yield redisClient.del(`job:${id}`);
      });
    });

    job.save();

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



  addSo2: function* () {
    const body = yield parse.json(this, { limit: '50mb' });

    // increment 'job' string in redis
    const id = yield redisClient.incr('job');

    // set/update 'so2:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`so2:eere:${id}`, JSON.stringify(body.eere));

    // add so2 job to queue
    var job = queue.create('calculate_so2', {
      title: `Calculate SO2 for '${body.region}' region`,
      jobId: id,
      region: body.region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${id} (SO2) is complete`);
        // remove 'so2:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`so2:eere:${id}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${id} (SO2) has failed`);
        // remove 'so2:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`so2:eere:${id}`);
        yield redisClient.del(`job:${id}`);
      });
    });

    job.save();

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



  addNox: function* () {
    const body = yield parse.json(this, { limit: '50mb' });

    // increment 'job' string in redis
    const id = yield redisClient.incr('job');

    // set/update 'nox:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`nox:eere:${id}`, JSON.stringify(body.eere));

    // add nox job to queue
    const job = queue.create('calculate_nox', {
      title: `Calculate NOx for '${body.region}' region`,
      jobId: id,
      region: body.region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${id} (NOx) is complete`);
        // remove 'nox:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`nox:eere:${id}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${id} (NOx) has failed`);
        // remove 'nox:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`nox:eere:${id}`);
        yield redisClient.del(`job:${id}`);
      });
    });

    job.save();

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



  addCo2: function* () {
    const body = yield parse.json(this, { limit: '50mb' });

    // increment 'job' string in redis
    const id = yield redisClient.incr('job');

    // set/update 'co2:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`co2:eere:${id}`, JSON.stringify(body.eere));

    // add co2 job to queue
    const job = queue.create('calculate_co2', {
      title: `Calculate CO2 for '${body.region}' region`,
      jobId: id,
      region: body.region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${id} (CO2) is complete`);
        // remove 'co2:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`co2:eere:${id}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${id} (CO2) has failed`);
        // remove 'co2:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`co2:eere:${id}`);
        yield redisClient.del(`job:${id}`);
      });
    });

    job.save();

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
