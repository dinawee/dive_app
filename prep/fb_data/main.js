// tutorial see https://www.youtube.com/watch?v=1VBgdKkuyNs
// and here http://lorenstewart.me/2017/03/12/using-node-js-to-interact-with-facebooks-graph-api/

const rp = require('request-promise');
const express = require('express');
const path = require('path');

// load express
var app = express();

// load db
const db = require('./db.js');

var port = 3000;

const CLIENT_FOLDER = path.join(__dirname, '/../client');

// routes
// first one is searchme - test searching my own fb acct 
app.use(express.static(CLIENT_FOLDER));

// list api
require('./routes.js')(app, db);


app.listen(port, function(){
    console.log("Server now running on localhost: %d", port);
});



