const fs = require('fs');
const co = require('co');
const kue = require('kue');
const Redis = require('redis');
const bluebird = require('bluebird');
const thunkify = require('thunkify');

const redisConfig = require('../../config/redis');
const redisClient = require('../../lib/redis');
const regions = require('../../lib/regions');
const Rdf = require('../Rdf');
const DisplacementsEngine = require('../DisplacementsEngine');

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
  console.log('error', 'node-redis', 'jobs/processJobFromQueue', err);
});

// --- setup queue
const queue = kue.createQueue({
  redis: {
    port: redisConfig.port,
    host: redisConfig.hostname,
    auth: redisConfig.password,
  }
});



module.exports = {
  calculateGeneration: function () {
    try {
      queue.process('calculate_generation', function (job, done) {
        const id = job.data.jobId;
        const region = job.data.region;

        if (!(region in regions)) {
          return false;
        }

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
      return true;

    } catch (e) {
      console.error(`Processing error: ${e}`);
      return false;
    }
  },

  calculateSo2: function () {
    try {
      queue.process('calculate_so2', function (job, done) {
        const id = job.data.jobId;
        const region = job.data.region;

        if (!(region in regions)) {
          return false;
        }

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
      return true;

    } catch (e) {
      console.error(`Processing error: ${e}`);
      return false;
    }
  },

  calculateNox: function () {
    try {
      queue.process('calculate_nox', function (job, done) {
        const id = job.data.jobId;
        const region = job.data.region;

        if (!(region in regions)) {
          return false;
        }

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
      return true;

    } catch (e) {
      console.error(`Processing error: ${e}`);
      return false;
    }
  },

  calculateCo2: function () {
    try {
      queue.process('calculate_co2', function (job, done) {
        const id = job.data.jobId;
        const region = job.data.region;

        if (!(region in regions)) {
          return false;
        }

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
      return true;

    } catch (e) {
      console.error(`Processing error: ${e}`);
      return false;
    }
  },
};
