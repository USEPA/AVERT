// const config = {
//     port: '14886',
//     host: 'redis-14886.c10.us-east-1-2.ec2.cloud.redislabs.com',
//     auth: '0eXWvt764YHr1MlP',
// };

// const config = {
//     port: '17769',
//     host: 'redis-17769.c10.us-east-1-4.ec2.cloud.redislabs.com',
//     auth: 'jCxo7pg1N8ueLa0z',
// };

const config = require('../../config/redis');

var kue = require('kue');
// var queue = kue.createQueue({
//     redis: {
//         port: config.port,
//         host: config.host,
//         auth: config.auth,
//     }
// });

var queue = kue.createQueue({
    redis: {
        port: config.port,
        host: config.hostname,
        auth: config.password,
    }
});

queue.on('connect', function() {
    console.log('connected to kue');
});

queue.on('error', function (err) {
    console.error('error','kue','jobs/addDisplacementJob',err);
});
const DisplacementsEngine = require('../displacements/DisplacementsEngine');
const Redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

// const redisSettings = require('../../config/redis');


// const db = Redis.createClient(config);
// db.auth(redisSettings.password);
// const db = Redis.createClient(config.port,config.host);
// db.auth(config.auth);

const db = Redis.createClient(config.port,config.hostname);
db.auth(config.password);
db.on('connect', function() {
    console.log('connected to redis');
});

db.on('error', function(err) {
    console.log('error','node-redis','jobs/addDisplacementJob',err);
});

const redis = require('../../lib/redis');
const thunkify = require('thunkify');
const fs = require('fs');
const regions = require('../../lib/regions');
const read = thunkify(fs.readFile);
const co = require('co');
const Rdf = require('../rdf/Rdf');

const displacementJobs = {};
displacementJobs.addGenerationJob = function (jobId, region) {
    var job = queue.create('calculate_generation', {
        jobId: jobId,
        region: region
    });

    job.on('complete', function () {
        co(function * () {
            console.log('Generation Job', job.data.jobId, 'is done');
            yield redis.del('generation:eere:' + job.data.jobId);
        });
    }).on('failed', function () {
        console.log('Generation Job', job.data.jobId, 'has failed');
        co(function * () {
            yield redis.del('generation:eere:' + job.data.jobId);
            yield redis.del('job:' + job.data.jobId);
        });
    });

    job.save();

    return job;
};

displacementJobs.addSo2Job = function (jobId, region) {
    var job = queue.create('calculate_so2', {
        jobId: jobId,
        region: region
    });

    job.on('complete', function () {
        co(function * () {
            console.log('SO2 Job', job.data.jobId, 'is done');
            yield redis.del('so2:eere:' + job.data.jobId);
        });
    }).on('failed', function () {
        console.log('SO2 Job', job.data.jobId, 'has failed');
        co(function * () {
            yield redis.del('so2:eere:' + job.data.jobId);
            yield redis.del('job:' + job.data.jobId);
        });
    });

    job.save();

    return job;
};

displacementJobs.addNoxJob = function (jobId, region) {
    var job = queue.create('calculate_nox', {
        jobId: jobId,
        region: region
    });

    job.on('complete', function () {
        co(function * () {
            console.log('NOx Job', job.data.jobId, 'is done');
            yield redis.del('nox:eere:' + job.data.jobId);
        });
    }).on('failed', function () {
        console.log('NOx Job', job.data.jobId, 'has failed');
        co(function * () {
            yield redis.del('nox:eere:' + job.data.jobId);
            yield redis.del('job:' + job.data.jobId);
        });
    });

    job.save();

    return job;
};

displacementJobs.addCo2Job = function (jobId, region) {
    var job = queue.create('calculate_co2', {
        jobId: jobId,
        region: region
    });

    job.on('complete', function () {
        co(function * () {
            console.log('CO2 Job', job.data.jobId, 'is done');
            yield redis.del('co2:eere:' + job.data.jobId);
        });
    }).on('failed', function () {
        console.log('CO2 Job', job.data.jobId, 'has failed');
        co(function * () {
            yield redis.del('co2:eere:' + job.data.jobId);
            yield redis.del('job:' + job.data.jobId);
        });
    });

    job.save();

    return job;
};
//
// queue.process('calculate_generation', function (job, done) {
//     const id = job.data.jobId;
//     console.log('....', 'Generation job', id);
//
//     co(function * () {
//         console.log('....', 'generation start');
//         let rdf = false;
//         if (job.data.region in regions) {
//             response = 'ok';
//             const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
//             const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
//             rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
//         }
//
//         if (! rdf) {
//             console.log('error', 'No RDF');
//             return false
//         }
//
//         let eere = yield redis.get('generation:eere:' + id);
//         if (! eere) done && done();
//         eere = JSON.parse(eere);
//         const engine = new DisplacementsEngine(rdf, eere);
//         const data = engine.getGeneration();
//         yield redis.set('job:' + id, JSON.stringify(data));
//         console.log('....', 'generation end');
//     }).then(val => {
//         console.log('....', 'generation done');
//         return done && done()
//     });
// });
//
// queue.process('calculate_so2', function (job, done) {
//     const id = job.data.jobId;
//     console.log('....', 'SO2 job', id);
//
//     co(function * () {
//         let rdf = false;
//         if (job.data.region in regions) {
//             response = 'ok';
//             const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
//             const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
//             rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
//         }
//
//         if (! rdf) {
//             console.log('error', 'No RDF');
//             return false;
//         }
//
//         let eere = yield redis.get('so2:eere:' + id);
//         if (! eere) done && done();
//         eere = JSON.parse(eere);
//         const engine = new DisplacementsEngine(rdf, eere);
//         const data = engine.getSo2Total();
//         yield redis.set('job:' + id, JSON.stringify(data));
//     }).then(val => {
//         return done && done()
//     });
// });
//
//
//
// queue.process('calculate_nox', function (job, done) {
//     const id = job.data.jobId;
//     console.log('....', 'NOx job', id);
//
//     co(function * () {
//         let rdf = false;
//         if (job.data.region in regions) {
//             response = 'ok';
//             const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
//             const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
//             rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
//         }
//
//         // if (! rdf) done && done();
//         if (! rdf) return false;
//
//         let eere = yield redis.get('nox:eere:' + id);
//         if (! eere) done && done();
//         eere = JSON.parse(eere);
//         const engine = new DisplacementsEngine(rdf, eere);
//         const data = engine.getNoxTotal();
//         yield redis.set('job:' + id, JSON.stringify(data));
//     }).then(val => {
//         return done && done()
//     });
// });
//
// queue.process('calculate_co2', function (job, done) {
//     const id = job.data.jobId;
//     console.log('....', 'CO2 job', id);
//
//     co(function * () {
//         let rdf = false;
//         if (job.data.region in regions) {
//             response = 'ok';
//             const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
//             const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
//             rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
//         }
//
//         // if (! rdf) done && done();
//         if (! rdf) return false;
//
//         let eere = yield redis.get('co2:eere:' + id);
//         if (! eere) done && done();
//         eere = JSON.parse(eere);
//         const engine = new DisplacementsEngine(rdf, eere);
//         const data = engine.getCo2Total();
//         yield redis.set('job:' + id, JSON.stringify(data));
//     }).then(val => {
//         return done && done()
//     });
// });

module.exports = displacementJobs;
