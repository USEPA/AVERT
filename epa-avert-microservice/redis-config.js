var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

const services = appEnv.getServices();
// const host = appEnv.getServiceURL('redis28');
// const host = appEnv.getServiceCreds('redis28');
// const services = appEnv.getServiceURL('avert-redis28');
// services.credentials.hostname
// services.credentials.port
// services.uri
// console.log('services',services);

// {
//  "VCAP_SERVICES": {
//   "redis28": [
//    {
//     "credentials": {
//      "hostname": "xd54c7e8577494.service.kubernetes",
//      "password": "wCvoc2sCyn",
//      "port": "32188",
//      "ports": {
//       "6379/tcp": "32188"
//      },
//      "uri": "redis://:wCvoc2sCyn@xd54c7e8577494.service.kubernetes:32188"
//     },
//     "label": "redis28",
//     "name": "avert-redis28",
//     "plan": "standard",
//     "provider": null,
//     "syslog_drain_url": null,
//     "tags": [
//      "redis28",
//      "redis"
//     ],
//     "volume_mounts": []
//    }
//   ]
//  }
// }

// module.exports = {
//     host: '10.10.3.133',
//     port: '32813',
// };

module.exports = {
    host: services.credentials.hostname,
    port: services.credentials.port,
}