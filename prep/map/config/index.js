'use strict';

var ENV = "development-cloud";

// .js is optional in require
module.exports = require('./' + ENV + '.js') || {};

