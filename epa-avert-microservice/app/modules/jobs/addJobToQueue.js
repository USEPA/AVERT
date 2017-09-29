const co = require('co');
const kue = require('kue');
const Redis = require('redis');
const bluebird = require('bluebird');
const redisConfig = require('../../config/redis');
const redisClient = require('../../lib/redis');

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

// --- setup redis
const db = Redis.createClient(redisConfig.port, redisConfig.hostname);
// provide authentication when connecting to cloud foundry redis service
if (process.env.WEB_SERVICE !== 'local') {
  db.auth(redisConfig.password);
}

db.on('error', function (err) {
  console.log('error', 'node-redis', 'jobs/addJobToQueue', err);
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
  addGenerationJob: function (jobId, region) {
    const job = queue.create('calculate_generation', {
      title: `Calculate Generation for '${region}' region`,
      jobId: jobId,
      region: region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${job.data.jobId} (Generation) is complete`);
        // remove 'generation:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`generation:eere:${job.data.jobId}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${job.data.jobId} (Generation) has failed`);
        // remove 'generation:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`generation:eere:${job.data.jobId}`);
        yield redisClient.del(`job:${job.data.jobId}`);
      });
    });

    job.save();
  },

  addSo2Job: function (jobId, region) {
    var job = queue.create('calculate_so2', {
      title: `Calculate SO2 for '${region}' region`,
      jobId: jobId,
      region: region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${job.data.jobId} (SO2) is complete`);
        // remove 'so2:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`so2:eere:${job.data.jobId}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${job.data.jobId} (SO2) has failed`);
        // remove 'so2:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`so2:eere:${job.data.jobId}`);
        yield redisClient.del(`job:${job.data.jobId}`);
      });
    });

    job.save();
  },

  addNoxJob: function (jobId, region) {
    var job = queue.create('calculate_nox', {
      title: `Calculate NOx for '${region}' region`,
      jobId: jobId,
      region: region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${job.data.jobId} (NOx) is complete`);
        // remove 'nox:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`nox:eere:${job.data.jobId}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${job.data.jobId} (NOx) has failed`);
        // remove 'nox:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`nox:eere:${job.data.jobId}`);
        yield redisClient.del(`job:${job.data.jobId}`);
      });
    });

    job.save();
  },

  addCo2Job: function (jobId, region) {
    var job = queue.create('calculate_co2', {
      title: `Calculate CO2 for '${region}' region`,
      jobId: jobId,
      region: region
    });

    job.on('complete', function () {
      co(function* () {
        console.log(`Success: Job ${job.data.jobId} (CO2) is complete`);
        // remove 'co2:eere:id' key and value from 'avert' hash in redis
        yield redisClient.del(`co2:eere:${job.data.jobId}`);
      });
    }).on('failed', function () {
      co(function* () {
        console.log(`Error: Job ${job.data.jobId} (CO2) has failed`);
        // remove 'co2:eere:id' and 'job:id' keys and values from 'avert' hash in redis
        yield redisClient.del(`co2:eere:${job.data.jobId}`);
        yield redisClient.del(`job:${job.data.jobId}`);
      });
    });

    job.save();
  },
};
