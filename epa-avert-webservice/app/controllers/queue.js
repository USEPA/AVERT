const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const kue = require('kue');

const redisConfig = require('../config/redis');
const redisClient = require('../lib/redis');
const regions = require('../lib/regions');
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
if (process.env.WEB_SERVICE === 'local') {
  kue.app.listen(3002, () => {
    console.log('Kue is running on http://localhost:3002');
  });
}

module.exports = {
  addGeneration: async (ctx) => {
    const body = await ctx.request.body;

    // increment 'job' string in redis
    const id = await redisClient.inc('job');

    // set/update 'generation:eere:id' key and value in 'avert' hash in redis
    await redisClient.set(`generation:eere:${id}`, JSON.stringify(body.eere));

    // add generation job to queue
    const job = queue.create('calculate_generation', {
      title: `Calculate Generation for '${body.region}' region`,
      jobId: id,
      region: body.region,
    });

    // 'complete' event fires when processGeneration() succeeds
    job.on('complete', async () => {
      console.log(`Success: Job ${id} (Generation) is complete`);
      redisClient.del(`generation:eere:${id}`);
      job.remove();
    });

    // 'failed' event fires when processGeneration() fails
    job.on('failed', async () => {
      console.log(`Error: Job ${id} (Generation) has failed`);
      redisClient.del(`generation:eere:${id}`);
    });

    job.save((err) => {
      if (!err) console.log(`Stored: Job ${id} (Generation) saved to Kue`);
    });

    // require 'http' or 'https' module, depending on request's protocol
    const http = require(`${ctx.protocol}`);
    // create request, which will process job from queue via processGeneration()
    http.get(`${ctx.protocol}://${ctx.header.host}/api/v1/queue/generation`);

    // web app uses job id to poll server for data via GET /api/v1/jobs/:id
    ctx.body = {
      response: 'ok',
      job: id,
    };
  },



  addSo2: async (ctx) => {
    const body = await ctx.request.body;

    // increment 'job' string in redis
    const id = await redisClient.inc('job');

    // set/update 'so2:eere:id' key and value in 'avert' hash in redis
    await redisClient.set(`so2:eere:${id}`, JSON.stringify(body.eere));

    // add so2 job to queue
    var job = queue.create('calculate_so2', {
      title: `Calculate SO2 for '${body.region}' region`,
      jobId: id,
      region: body.region,
    });

    // 'complete' event fires when processSo2() succeeds
    job.on('complete', async () => {
      console.log(`Success: Job ${id} (SO2) is complete`);
      redisClient.del(`so2:eere:${id}`);
    });

    // 'failed' event fires when processSo2() fails
    job.on('failed', async () => {
      console.log(`Error: Job ${id} (SO2) has failed`);
      redisClient.del(`so2:eere:${id}`);
    });

    job.save((err) => {
      if (!err) console.log(`Stored: Job ${id} (SO2) saved to Kue`);
    });

    // require 'http' or 'https' module, depending on request's protocol
    const http = require(`${ctx.protocol}`);
    // create request, which will process job from queue via processSo2()
    http.get(`${ctx.protocol}://${ctx.header.host}/api/v1/queue/so2`);

    // web app uses job id to poll server for data via GET /api/v1/jobs/:id
    ctx.body = {
      response: 'ok',
      job: id,
    };
  },



  addNox: async (ctx) => {
    const body = await ctx.request.body;

    // increment 'job' string in redis
    const id = await redisClient.inc('job');

    // set/update 'nox:eere:id' key and value in 'avert' hash in redis
    await redisClient.set(`nox:eere:${id}`, JSON.stringify(body.eere));

    // add nox job to queue
    const job = queue.create('calculate_nox', {
      title: `Calculate NOx for '${body.region}' region`,
      jobId: id,
      region: body.region,
    });

    // 'complete' event fires when processNox() succeeds
    job.on('complete', async () => {
      console.log(`Success: Job ${id} (NOx) is complete`);
      redisClient.del(`nox:eere:${id}`);
      job.remove();
    });

    // 'failed' event fires when processNox() fails
    job.on('failed', async () => {
      console.log(`Error: Job ${id} (NOx) has failed`);
      redisClient.del(`nox:eere:${id}`);
    });

    job.save((err) => {
      if (!err) console.log(`Stored: Job ${id} (NOx) saved to Kue`);
    });

    // require 'http' or 'https' module, depending on request's protocol
    const http = require(`${ctx.protocol}`);
    // create request, which will process job from queue via processNox()
    http.get(`${ctx.protocol}://${ctx.header.host}/api/v1/queue/nox`);

    // web app uses job id to poll server for data via GET /api/v1/jobs/:id
    ctx.body = {
      response: 'ok',
      job: id,
    };
  },



  addCo2: async (ctx) => {
    const body = await ctx.request.body;

    // increment 'job' string in redis
    const id = await redisClient.inc('job');

    // set/update 'co2:eere:id' key and value in 'avert' hash in redis
    await redisClient.set(`co2:eere:${id}`, JSON.stringify(body.eere));

    // add co2 job to queue
    const job = queue.create('calculate_co2', {
      title: `Calculate CO2 for '${body.region}' region`,
      jobId: id,
      region: body.region,
    });

    // 'complete' event fires when processCo2() succeeds
    job.on('complete', async () => {
      console.log(`Success: Job ${id} (CO2) is complete`);
      redisClient.del(`co2:eere:${id}`);
      job.remove();
    });

    // 'failed' event fires when processCo2() fails
    job.on('failed', async () => {
      console.log(`Error: Job ${id} (CO2) has failed`);
      redisClient.del(`co2:eere:${id}`);
    });

    job.save((err) => {
      if (!err) console.log(`Stored: Job ${id} (CO2) saved to Kue`);
    });

    // require 'http' or 'https' module, depending on request's protocol
    const http = require(`${ctx.protocol}`);
    // create request, which will process job from queue via processCo2()
    http.get(`${ctx.protocol}://${ctx.header.host}/api/v1/queue/co2`);

    // web app uses job id to poll server for data via GET /api/v1/jobs/:id
    ctx.body = {
      response: 'ok',
      job: id,
    };
  },



  addPm25: async (ctx) => {
    const body = await ctx.request.body;

    // increment 'job' string in redis
    const id = await redisClient.inc('job');

    // set/update 'pm25:eere:id' key and value in 'avert' hash in redis
    await redisClient.set(`pm25:eere:${id}`, JSON.stringify(body.eere));

    // add pm25 job to queue
    const job = queue.create('calculate_pm25', {
      title: `Calculate Pm25 for '${body.region}' region`,
      jobId: id,
      region: body.region,
    });

    // 'complete' event fires when processPm25() succeeds
    job.on('complete', async () => {
      console.log(`Success: Job ${id} (Pm25) is complete`);
      redisClient.del(`pm25:eere:${id}`);
      job.remove();
    });

    // 'failed' event fires when processPm25() fails
    job.on('failed', async () => {
      console.log(`Error: Job ${id} (Pm25) has failed`);
      redisClient.del(`pm25:eere:${id}`);
    });

    job.save((err) => {
      if (!err) console.log(`Stored: Job ${id} (Pm25) saved to Kue`);
    });

    // require 'http' or 'https' module, depending on request's protocol
    const http = require(`${ctx.protocol}`);
    // create request, which will process job from queue via processPm25()
    http.get(`${ctx.protocol}://${ctx.header.host}/api/v1/queue/pm25`);

    // web app uses job id to poll server for data via GET /api/v1/jobs/:id
    ctx.body = {
      response: 'ok',
      job: id,
    };
  },



  processGeneration: (ctx) => {
    queue.process('calculate_generation', async (job, done) => {
      const id = job.data.jobId;
      const region = job.data.region;

      console.log(id);

      if (!(region in regions)) return false;

        console.log(`Processing: Job ${id} (Generation) starting`);

        // instantiate new Rdf from data files
        const rdfFile = await readFile(regions[region].rdf);
        const defaultsFile = await readFile(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(defaultsFile, 'utf8')
        }).toJSON();

        // get 'generation:eere:id' value in 'avert' hash in redis
        const eere = await redisClient.get(`generation:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get generation data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getGeneration();

        // set 'job:id' key and value in 'avert' hash in redis
        await redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (Generation) finished`);
        return done();
    });

    // return status for debugging (not used in web app)
    ctx.body = {
      response: 'ok',
      status: 'calculate_generation',
    };
  },



  processSo2: (ctx) => {
    queue.process('calculate_so2', async (job, done) => {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) return false;

        console.log(`Processing: Job ${id} (SO2) starting`);

        // instantiate new Rdf from data files
        const rdfFile = await readFile(regions[region].rdf);
        const defaultsFile = await readFile(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(defaultsFile, 'utf8')
        }).toJSON();

        // get 'so2:eere:id' value in 'avert' hash in redis
        const eere = await redisClient.get(`so2:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get so2 total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getSo2Total();

        // set 'job:id' key and value in 'avert' hash in redis
        await redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (SO2) finished`);
        return done();
    });

    // return status for debugging (not used in web app)
    ctx.body = {
      response: 'ok',
      status: 'calculate_so2',
    };
  },



  processNox: (ctx) => {
    queue.process('calculate_nox', async (job, done) => {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) return false;

        console.log(`Processing: Job ${id} (NOx) starting`);

        // instantiate new Rdf from data files
        const rdfFile = await readFile(regions[region].rdf);
        const defaultsFile = await readFile(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(defaultsFile, 'utf8')
        }).toJSON();

        // get 'nox:eere:id' value in 'avert' hash in redis
        const eere = await redisClient.get(`nox:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get nox total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getNoxTotal();

        // set 'job:id' key and value in 'avert' hash in redis
        await redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (NOx) finished`);
        return done();
    });

    // return status for debugging (not used in web app)
    ctx.body = {
      response: 'ok',
      status: 'calculate_nox',
    };
  },



  processCo2: (ctx) => {
    queue.process('calculate_co2', async (job, done) => {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) return false;

        console.log(`Processing: Job ${id} (SO2) starting`);

        // instantiate new Rdf from data files
        const rdfFile = await readFile(regions[region].rdf);
        const defaultsFile = await readFile(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(defaultsFile, 'utf8')
        }).toJSON();

        // get 'co2:eere:id' value in 'avert' hash in redis
        const eere = await redisClient.get(`co2:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get co2 total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getCo2Total();

        // set 'job:id' key and value in 'avert' hash in redis
        await redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (CO2) finished`);
        return done();
    });

    // return status for debugging (not used in web app)
    ctx.body = {
      response: 'ok',
      status: 'calculate_co2',
    };
  },



  processPm25: (ctx) => {
    queue.process('calculate_pm25', async (job, done) => {
      const id = job.data.jobId;
      const region = job.data.region;

      if (!(region in regions)) return false;

        console.log(`Processing: Job ${id} (PM25) starting`);

        // instantiate new Rdf from data files
        const rdfFile = await readFile(regions[region].rdf);
        const defaultsFile = await readFile(regions[region].defaults);
        const rdf = new Rdf({
          rdf: JSON.parse(rdfFile, 'utf8'),
          defaults: JSON.parse(defaultsFile, 'utf8')
        }).toJSON();

        // get 'pm25:eere:id' value in 'avert' hash in redis
        const eere = await redisClient.get(`pm25:eere:${id}`);
        // return early if eere not found in redis
        if (!eere) { done(); }

        // get pm25 total data from new DisplacementEngine instance
        const engine = new DisplacementsEngine(rdf, JSON.parse(eere));
        const data = engine.getPm25Total();

        // set 'job:id' key and value in 'avert' hash in redis
        await redisClient.set(`job:${id}`, JSON.stringify(data));

        console.log(`Processing: Job ${id} (PM25) finished`);
        return done();
    });

    // return status for debugging (not used in web app)
    ctx.body = {
      response: 'ok',
      status: 'calculate_pm25',
    };
  },
};
