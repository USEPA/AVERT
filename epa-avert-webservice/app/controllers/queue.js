const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const kue = require('kue');
const request = require('request');

const redisConfig = require('../lib/redisConfig');
const redisClient = require('../lib/redisClient');
const regions = require('../lib/regionsEnum');
const Rdf = require('../engines/Rdf');
const DisplacementsEngine = require('../engines/DisplacementsEngine');

// --- setup queue
const queue = kue.createQueue({
  redis: {
    port: redisConfig.port,
    host: redisConfig.hostname,
    auth: redisConfig.password,
  }
});

// --- display kue dashboard (local development only)
if (process.env.KOA_APP_ENV === 'local') {
  kue.app.listen(3002, () => {
    console.log('Kue is running on http://localhost:3002');
  });
}

// add pollutant to queue
const addPollutant = async (ctx, pollutant) => {
  const body = await ctx.request.body;
  // increment 'job' string in redis
  const id = await redisClient.inc('job');
  // set 'pollutant:eere:id' key and value in 'avert' hash in redis
  await redisClient.set(`${pollutant}:eere:${id}`, JSON.stringify(body.eere));
  // add pollutant job to queue
  const job = queue.create(`calculate_${pollutant}`, {
    title: `Calculate ${pollutant} for '${body.region}' region`,
    jobId: id,
    region: body.region,
  }).save((err) => {
    if (!err) console.log(`Queue: ${id} (${pollutant}) added to queue`);
  });;
  // 'complete' or 'failed' event fires when processPollutant() succeeds or fails
  // remove job and 'pollutant:eere:id' key and value in 'avert' hash in redis
  job.on('complete', () => {
    console.log(`Queue: ${id} (${pollutant}) is complete`);
    redisClient.del(`${pollutant}:eere:${id}`);
    job.remove();
  }).on('failed', () => {
    console.log(`Queue: ${id} (${pollutant}) has failed`);
    redisClient.del(`${pollutant}:eere:${id}`);
    job.remove();
  });
  // create request, which will process job from queue via processPollutant()
  request(`${ctx.origin}/api/v1/queue/${pollutant}`, (err, res, body) => {
    if (err) console.log('Fetch error:', err);
  });
  // web app uses job id to poll server for data via GET /api/v1/jobs/:id
  ctx.body = {
    response: 'ok',
    job: id,
  };
};

// process pollutant from queue
const processPollutant = (ctx, pollutant) => {
  queue.process(`calculate_${pollutant}`, async (job, done) => {
    const id = job.data.jobId;
    const region = job.data.region;
    if (!(region in regions)) return false;
    //
    console.log(`Queue: ${id} (${pollutant}) is processing`);
    // instantiate new Rdf from data files
    const rdfFile = await readFile(regions[region].rdf);
    const rdf = new Rdf(JSON.parse(rdfFile, 'utf8')).toJSON();
    // get 'pollutant:eere:id' value in 'avert' hash in redis
    const eere = await redisClient.get(`${pollutant}:eere:${id}`);
    // return early if eere not found in redis
    if (!eere) done();
    // get pollutant data from new DisplacementEngine instance
    const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
    let data;
    if (pollutant === 'generation') data = engine.getGeneration();
    if (pollutant === 'so2') data = engine.getSo2Total();
    if (pollutant === 'nox') data = engine.getNoxTotal();
    if (pollutant === 'co2') data = engine.getCo2Total();
    if (pollutant === 'pm25') data = engine.getPm25Total();
    // set 'job:id' key and value in 'avert' hash in redis
    await redisClient.set(`job:${id}`, JSON.stringify(data));
    //
    console.log(`Queue: ${id} (${pollutant}) finished processing`);
    return done();
  });

  // return status for debugging (not used in web app)
  ctx.body = {
    response: 'ok',
    status: `${pollutant} processed`,
  };
}

module.exports = {
  addGeneration: (ctx) => addPollutant(ctx, 'generation'),
  addSo2: (ctx) => addPollutant(ctx, 'so2'),
  addNox: (ctx) => addPollutant(ctx, 'nox'),
  addCo2: (ctx) => addPollutant(ctx, 'co2'),
  addPm25: (ctx) => addPollutant(ctx, 'pm25'),
  processGeneration: (ctx) => processPollutant(ctx, 'generation'),
  processSo2: (ctx) => processPollutant(ctx, 'so2'),
  processNox: (ctx) => processPollutant(ctx, 'nox'),
  processCo2: (ctx) => processPollutant(ctx, 'co2'),
  processPm25: (ctx) => processPollutant(ctx, 'pm25'),
};
