const config = require('../../config/redis');
const kue = require('kue');
const queue = kue.createQueue({
    redis: {
        port: config.port,
        host: config.hostname,
        auth: config.password,
    }
});

queue.on('connect', function () {
    console.log('connected to kue');
});

queue.on('error', function (err) {
    console.error('error', 'kue', 'jobs/addDisplacementJob', err);
});
const DisplacementsEngine = require('../displacements/DisplacementsEngine');
const Redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

const db = Redis.createClient(config.port, config.hostname);
db.auth(config.password);
db.on('connect', function () {
    console.log('connected to redis');
});

db.on('error', function (err) {
    console.log('error', 'node-redis', 'jobs/addDisplacementJob', err);
});

const redis = require('../../lib/redis');
const thunkify = require('thunkify');
const fs = require('fs');
const regions = require('../../types/regions');
const read = thunkify(fs.readFile);
const co = require('co');
const Rdf = require('../rdf/Rdf');

const displacementJobs = {};
displacementJobs.calculate_generation = function () {
    try {
        queue.process('calculate_generation', function (job, done) {
            const id = job.data.jobId;
            console.log('Processing:', 'Generation job', id);

            co(function * () {
                console.log('Processing:', 'generation start');
                let rdf = false;
                if (job.data.region in regions) {
                    response = 'ok';
                    const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
                    const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
                    rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
                }

                if (! rdf) {
                    console.log('error', 'No RDF');
                    return false
                }

                let eere = yield redis.get('generation:eere:' + id);
                if (! eere) done && done();
                eere = JSON.parse(eere);
                const engine = new DisplacementsEngine(rdf, eere);
                const data = engine.getGeneration();
                yield redis.set('job:' + id, JSON.stringify(data));
                console.log('Processing:', 'generation end');
            }).then(val => {
                console.log('Processing:', 'generation done');
                return done && done()
            });
        });
        return true;
    } catch (e) {
        console.error('Process error',e);
        return false;
    }
};

displacementJobs.calculate_so2 = function () {
    try {
        queue.process('calculate_so2', function (job, done) {
            const id = job.data.jobId;
            console.log('Processing:', 'SO2 job', id);

            co(function * () {
                let rdf = false;
                if (job.data.region in regions) {
                    response = 'ok';
                    const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
                    const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
                    rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
                }

                if (! rdf) {
                    console.log('error', 'No RDF');
                    return false;
                }

                let eere = yield redis.get('so2:eere:' + id);
                if (! eere) done && done();
                eere = JSON.parse(eere);
                const engine = new DisplacementsEngine(rdf, eere);
                const data = engine.getSo2Total();
                yield redis.set('job:' + id, JSON.stringify(data));
                console.log('Processing:', 'so2 end');
            }).then(val => {
                console.log('Processing:', 'so2 done');
                return done && done()
            });
        });
        return true;
    } catch (e) {
        console.error('Process error',e);
        return false;
    }
};

displacementJobs.calculate_nox = function () {
    try {
        queue.process('calculate_nox', function (job, done) {
            const id = job.data.jobId;
            console.log('Processing:', 'NOx job', id);

            co(function * () {
                let rdf = false;
                if (job.data.region in regions) {
                    response = 'ok';
                    const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
                    const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
                    rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
                }

                // if (! rdf) done && done();
                if (! rdf) return false;

                let eere = yield redis.get('nox:eere:' + id);
                if (! eere) done && done();
                eere = JSON.parse(eere);
                const engine = new DisplacementsEngine(rdf, eere);
                const data = engine.getNoxTotal();
                yield redis.set('job:' + id, JSON.stringify(data));
                console.log('Processing:', 'nox end');
            }).then(val => {
                console.log('Processing:', 'nox done');
                return done && done()
            });
        });

        return true;
    } catch (e) {
        console.error('Process error',e);
        return false;
    }
};

displacementJobs.calculate_co2 = function () {
    try {
        queue.process('calculate_co2', function (job, done) {
            const id = job.data.jobId;
            console.log('Processing:', 'CO2 job', id);

            co(function * () {
                let rdf = false;
                if (job.data.region in regions) {
                    response = 'ok';
                    const rawRdf = JSON.parse(yield read(regions[job.data.region].rdf, 'utf8'));
                    const rawDefaults = JSON.parse(yield read(regions[job.data.region].defaults, 'utf8'));
                    rdf = new Rdf({rdf: rawRdf, defaults: rawDefaults}).toJSON();
                }

                // if (! rdf) done && done();
                if (! rdf) return false;

                let eere = yield redis.get('co2:eere:' + id);
                if (! eere) done && done();
                eere = JSON.parse(eere);
                const engine = new DisplacementsEngine(rdf, eere);
                const data = engine.getCo2Total();
                yield redis.set('job:' + id, JSON.stringify(data));
                console.log('Processing:', 'co2 end');
            }).then(val => {
                console.log('Processing:', 'co2 done');
                return done && done()
            });
        });

        return true;
    } catch (e) {
        console.error('Process error',e);
        return false;
    }
};

module.exports = displacementJobs;
