
// ONLY for local running 

var config = require('./../config');

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

const DiveOperators = sequelize.import('./../models/dive_operators.js');
const PrepDiveOperators = sequelize.import('./../models/prep_dive_operators.js');


// var testObject = {
//     id: 1345355355,
//     location: {
//         latitude: -45.75985747,
//         longitude: 145.588975
//     }
// }

// postOne(testObject);


function postOne(object) {
    // insert req, res
    return PrepDiveOperators // return the promise 
        .create({
            fb_id: object.id,
            latitude: object.location.latitude,
            longitude: object.location.longitude,
            name: object.name,
        }
        )
        .then(function (record) {
            console.log('Sucess insert record');
            return record; // returns the record
        })
        .catch(function (err) {
            console.log('Some err happened');
            console.log(err);
            console.log(JSON.stringify(err));
        })
}


var resultsObject = require('./rawresults.json');

function promise() {
    var object = {};
    return new Promise(function (resolve, reject) {
        object.id = resultsObject[i].id;
        object.location = resultsObject[i].location;
        object.name = resultsObject[i].name;
        resolve(object);
    });
}


for (var i in resultsObject) {
    promise()
        .then(function (object) {
            return postOne(object); // this return is to push the result along
        })
        .then(function (result) {
            console.log('Wrote record: ' + JSON.stringify(result));
        })
        .catch(function (err) {
            console.log("The err is " + err);
        });
}
