'use strict';

var ENV = process.env.NODE_ENV || "development-cloud";

console.log('The env is ' + ENV);

// .js is optional in require
module.exports = require('./' + ENV + '.js') || {};

