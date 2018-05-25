const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();
const services = appEnv.getServices();

// local redis settings (requires redis-server be running)
let redis = {
  port: '6379',
  hostname: '127.0.0.1',
  password: null,
};

// cloud foundry redis service settings
if (process.env.KOA_APP_ENV !== 'dev') {
  redis = services['avert-redis'].credentials;
}

module.exports = {
  port: redis.port,
  hostname: redis.hostname,
  password: redis.password,
}
