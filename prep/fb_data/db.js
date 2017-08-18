// mysql username and pw all root root
var config = require('./config');

var Sequelize = require("sequelize");

// small sequelize is the DB object, first param is DB name: grocery 
var sequelize = new Sequelize('dive_app',
    config.MYSQL_USERNAME,
	config.MYSQL_PASSWORD,
    {
		host: config.MYSQL_HOSTNAME,
		port: config.MYSQL_PORT,
		logging: config.MYSQL_LOGGING,
		dialect: 'mysql',
		pool: {
			max: 5,
			min: 0,
			idle: 30000,
		},
	}
);

// use .import to avoid double loading problem with require 
// note DiveOperators == dive_operators table
const DiveOperators = sequelize.import('./models/dive_operators.js'); 
const PrepDiveOperators = sequelize.import('./models/prep_dive_operators.js'); 

// const Divespots = sequelize.import('./models/divespots.js'); 

// export to app.js 
module.exports = {
    DiveOperators: DiveOperators,
    PrepDiveOperators: PrepDiveOperators
    // Divespots: Divespots
};