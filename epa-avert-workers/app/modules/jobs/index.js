const redis = require('../../lib/redis');
const displacementJobs = require('../jobs/addDisplacementJob');

// Controller
const JobsController = {
    post: function* () {
        var id = yield redis.incr('job');
        yield redis.set('job:' + id,Math.random());
        this.body = yield redis.get('job:' + id);

        this.body = {
            response: 'ok',
            job: id,
        };
    },
    get: function* (id) {
        var data = yield redis.get('job:' + id);
        var response = 'ok';
        if(data === null) {
            response = 'in progress'
        } else {
            // redis.del('job:' + id, 10);
        }
        this.body = {
            response: response,
            job: id,
            data: JSON.parse(data),
        };
    },

    process: function* (id) {
        console.log('process',id);
        displacementJobs[id]();

        this.body = {
            response: 'ok',
            type: id,
        };
    },
};

module.exports = JobsController;