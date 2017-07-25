'use strict';

var ENV = process.env.NODE_ENV || "development-cloud" ||'development';

// .js is optional in require
module.exports = require('./' + ENV + '.js') || {};

