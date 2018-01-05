const fs = require('fs');
const co = require('co');
const parse = require('co-body');
const request = require('koa-request');
const thunkify = require('thunkify');
const kue = require('kue');
const Redis = require('redis');
const bluebird = require('bluebird');

const redisConfig = require('../config/redis');
const redisClient = require('../lib/redis');
const regions = require('../lib/regions');
const Rdf = require('../modules/Rdf');
const DisplacementsEngine = require('../modules/DisplacementsEngine');

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

const read = thunkify(fs.readFile);

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

    // create request, which will process job from queue via processGeneration()
    yield request({
      url: `http://${this.request.header.host}/api/v1/queue/generation`,
      headers: { 'User-Agent': 'request' },
    });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    };
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

    // create request, which will process job from queue via processSo2()
    yield request({
      url: `http://${this.request.header.host}/api/v1/queue/so2`,
      headers: { 'User-Agent': 'request' },
    });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    };
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

    // create request, which will process job from queue via processNox()
    yield request({
      url: `http://${this.request.header.host}/api/v1/queue/nox`,
      headers: { 'User-Agent': 'request' },
    });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    };
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

    // create request, which will process job from queue via processCo2()
    yield request({
      url: `http://${this.request.header.host}/api/v1/queue/co2`,
      headers: { 'User-Agent': 'request' },
    });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    };
  },



  addPm25: function* () {
    const body = yield parse.json(this, { limit: '50mb' });

    // increment 'job' string in redis
    const id = yield redisClient.incr('job');

    // set/update 'pm25:eere:id' key and value in 'avert' hash in redis
    yield redisClient.set(`pm25:eere:${id}`, JSON.stringify(body.eere));

    // add pm25 job to queue
    const job = queue.create('calculate_pm25', {
      title: `Calculate Pm25 for '${body.region}' region`,
      jobId: id,
      region: body.region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${id} (Pm25) is complete`);
        // remove 'pm25:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`pm25:eere:${id}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${id} (Pm25) has failed`);
        // remove 'pm25:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`pm25:eere:${id}`);
        yield redisClient.del(`job:${id}`);
      });
    });

    job.save();

    // create request, which will process job from queue via processPm25()
    yield request({
      url: `http://${this.request.header.host}/api/v1/queue/pm25`,
      headers: { 'User-Agent': 'request' },
    });

    // return 'ok' response and job id (used by web app)
    this.body = {
      response: 'ok',
      job: id,
    };
  },



  processGeneration: function* () {
    queue.process('calculate_generation', function (job, done) {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) { return false; }

      co(function* () {
        console.log(`Processing: Job ${id} (Generation) starting`);

        // instantiate new Rdf from data files
        const rdfFile = yield read(regions[region].rdf);
        const eereFile = yield read(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(eereFile, 'utf8')
        }).toJSON();

        // get 'generation:eere:id' value in 'avert' hash in redis
        const eere = yield redisClient.get(`generation:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get generation data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getGeneration();

        // set 'job:id' key and value in 'avert' hash in redis
        yield redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (Generation) finished`);
        return done();
      });
    });

    // return status for debugging (not used in web app)
    this.body = {
      response: 'ok',
      status: 'calculate_generation',
    };
  },



  processSo2: function* () {
    queue.process('calculate_so2', function (job, done) {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) { return false; }

      co(function* () {
        console.log(`Processing: Job ${id} (SO2) starting`);

        // instantiate new Rdf from data files
        const rdfFile = yield read(regions[region].rdf);
        const eereFile = yield read(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(eereFile, 'utf8')
        }).toJSON();

        // get 'so2:eere:id' value in 'avert' hash in redis
        const eere = yield redisClient.get(`so2:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get so2 total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getSo2Total();

        // set 'job:id' key and value in 'avert' hash in redis
        yield redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (SO2) finished`);
        return done();
      });
    });

    // return status for debugging (not used in web app)
    this.body = {
      response: 'ok',
      status: 'calculate_so2',
    };
  },



  processNox: function* () {
    queue.process('calculate_nox', function (job, done) {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) { return false; }

      co(function* () {
        console.log(`Processing: Job ${id} (NOx) starting`);

        // instantiate new Rdf from data files
        const rdfFile = yield read(regions[region].rdf);
        const eereFile = yield read(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(eereFile, 'utf8')
        }).toJSON();

        // get 'nox:eere:id' value in 'avert' hash in redis
        const eere = yield redisClient.get(`nox:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get nox total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getNoxTotal();

        // set 'job:id' key and value in 'avert' hash in redis
        yield redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (NOx) finished`);
        return done();
      });
    });

    // return status for debugging (not used in web app)
    this.body = {
      response: 'ok',
      status: 'calculate_nox',
    };
  },



  processCo2: function* () {
    queue.process('calculate_co2', function (job, done) {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) { return false; }

      co(function* () {
        console.log(`Processing: Job ${id} (SO2) starting`);

        // instantiate new Rdf from data files
        const rdfFile = yield read(regions[region].rdf);
        const eereFile = yield read(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(eereFile, 'utf8')
        }).toJSON();

        // get 'co2:eere:id' value in 'avert' hash in redis
        const eere = yield redisClient.get(`co2:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get co2 total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getCo2Total();

        // set 'job:id' key and value in 'avert' hash in redis
        yield redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (CO2) finished`);
        return done();
      });
    });

    // return status for debugging (not used in web app)
    this.body = {
      response: 'ok',
      status: 'calculate_co2',
    };
  },



  processPm25: function* () {
    queue.process('calculate_pm25', function (job, done) {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) { return false; }

      co(function* () {
        console.log(`Processing: Job ${id} (PM25) starting`);

        // instantiate new Rdf from data files
        const rdfFile = yield read(regions[region].rdf);
        const eereFile = yield read(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(eereFile, 'utf8')
        }).toJSON();

        // get 'pm25:eere:id' value in 'avert' hash in redis
        const eere = yield redisClient.get(`pm25:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get pm25 total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getPm25Total();

        // set 'job:id' key and value in 'avert' hash in redis
        yield redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (PM25) finished`);
        return done();
      });
    });

    // return status for debugging (not used in web app)
    this.body = {
      response: 'ok',
      status: 'calculate_pm25',
    };
  },
};
