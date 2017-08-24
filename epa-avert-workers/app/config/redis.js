var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

const services = appEnv.getServices();
const redisService = services['avert-redis28'];

// module.exports = {
//   port: '14886',
//   host: 'redis-14886.c10.us-east-1-2.ec2.cloud.redislabs.com',
//   password: '0eXWvt764YHr1MlP',
// };

// module.exports = {
//     "hostname": "redis-17769.c10.us-east-1-4.ec2.cloud.redislabs.com",
//     "password": "jCxo7pg1N8ueLa0z",
//     "port": "17769"
// };

// module.exports = {
//     "hostname": "redis-14500.c8.us-east-1-2.ec2.cloud.redislabs.com",
//     "password": "2WoFxGeKuDFuIoxB",
//     "port": "14500"
// };

// module.exports = {
//   "hostname": "redis-18520.c11.us-east-1-3.ec2.cloud.redislabs.com",
//   "password": "x05VCovqKeCfQwqL",
//   "port": "18520"
// }

module.exports = {
    hostname: redisService.credentials.hostname,
    password: redisService.credentials.password,
    port: redisService.credentials.port,
}