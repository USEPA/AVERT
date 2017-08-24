var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

const services = appEnv.getServices();
const redisService = services['avert-redis28'];

// module.exports = {
//     "hostname": "redis-14500.c8.us-east-1-2.ec2.cloud.redislabs.com",
//     "password": "2WoFxGeKuDFuIoxB",
//     "port": "14500"
// };

// module.exports = {
//   "hostname": "redis-18520.c11.us-east-1-3.ec2.cloud.redislabs.com",
//   "password": "x05VCovqKeCfQwqL",
//   "port": "18520"
// };
// 
// 

module.exports = {
    hostname: redisService.credentials.hostname,
    password: redisService.credentials.password,
    port: redisService.credentials.port,
}