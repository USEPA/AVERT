const Profile = require('./Profile');

// "Database"
const profiles = [
    new Profile('John Smith'),
    new Profile('Bob Ross'),
];

// Controller
const ExampleController = {
    hello: function * () {
        if (this.req.checkContinue) this.res.writeContinue();

        this.body = 'Service is running...';
    },

    list: function *list () {
        this.body = {profiles: profiles};
    },

    show: function *show (id) {
        const profile = profiles[id];
        if (! profile) this.throw(404, 'invalid profile id');

        this.body = {profile: profile};
    }
};

module.exports = ExampleController;
