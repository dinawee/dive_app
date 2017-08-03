/*
*
*
* CHANGE THE CONFIG PATH
*/

var fs = require("fs");

var configPath = function () {
    try {
        fs.accessSync(__dirname + "/../prep/fb_data/config/development-cloud.js");
        return (__dirname + "/../prep/fb_data/config/development-cloud.js");
    } catch (e) {
        return (__dirname + "/../prep/map/config/development-cloud.js");
    }
}

var config = require(configPath());

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
            idle: 10000,
        },
    }
);

// note DiveOperators == dive_operators table
// all our model names are PLURAL, same as table names
const DiveOperators = sequelize.import('./models/dive_operators.js');
const Users = sequelize.import('./models/users.js');
const Bookmarks = sequelize.import('./models/bookmarks.js');


/* 
    Associations
    Be safe and spell out FK columns to prevent sequelize from generating funny stuff
    Note that the FKs only reside in the users table, they REFERENCE the PKs in other table

    No need targetKey unless you want to specify another column
*/ 

Users.belongsToMany(DiveOperators, {through: Bookmarks, foreignKey:'user_id' });
// this is for creation - you can call Users.DiveOperators
DiveOperators.belongsToMany(Users, {through: Bookmarks, foreignkey:'dive_operator_id'});
Bookmarks.belongsTo(DiveOperators, {foreignKey: 'dive_operator_id' });
// so you can call Bookmarks.getDiveOperator

//prep routes
const prep_DiveOperators = sequelize.import('./models/prep/prep_dive_operators.js');
const prep_Divespots = sequelize.import('./models/prep/prep_divespots.js');
const prep_DiveRegions = sequelize.import('./models/prep/prep_dive_regions.js');

sequelize.sync({ force: false })
    .then(function () {
        console.log('Database now in sync');
    });

module.exports = {
    DiveOperators: DiveOperators,
    Users: Users,
    Bookmarks: Bookmarks,

    //prep
    prep_DiveOperators: prep_DiveOperators,
    prep_Divespots: prep_Divespots,
    prep_DiveRegions: prep_DiveRegions
};