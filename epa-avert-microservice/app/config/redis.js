const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();
const services = appEnv.getServices();

let redis;
if (process.env.WEB_SERVICE !== 'local') {
  // cloud foundry redis service
  redis = services['avert-redis32'].credentials;
} else {
  // local settings (requires redis-server be running)
  redis = {
    port: '6379',
    hostname: '127.0.0.1',
    password: null,
  };
}

module.exports = {
  port: redis.port,
  hostname: redis.hostname,
  password: redis.password,
}
