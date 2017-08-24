var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

const services = appEnv.getServices();


module.exports = {
    host: services.credentials.hostname,
    port: services.credentials.port,
}