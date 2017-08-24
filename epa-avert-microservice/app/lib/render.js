const views = require('co-views');
const path = require('path');

const render = views(path.join(__dirname, '/../views'), { map: { html: 'swig' }});

module.exports = render;