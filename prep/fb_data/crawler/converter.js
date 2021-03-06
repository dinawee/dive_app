// converts rawresults to MongoDB readable format => mongoresults.json

var fs = require('fs');

// shortcut use require
var rawResults = require('./rawresults.json');
var resultFilePath = __dirname + '/mongoresults.json';

var writeStream = fs.createWriteStream(resultFilePath);

// create new var with an array - can remove it manually
for (var i in rawResults){
    writeStream.write(JSON.stringify(rawResults[i]) + '\n');
}

writeStream.end();
