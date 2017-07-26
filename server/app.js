const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

// load express
var app = express();

// load DB
const db = require('./db.js');

var port = 3000;

const CLIENT_FOLDER = path.join(__dirname, '/../client');

// routes
// first one is searchme - test searching my own fb acct 
app.use(express.static(CLIENT_FOLDER));
app.use(bodyParser.json());

// list api
require('./routes.js')(app, db);


app.listen(port, function(){
    console.log("Server now running on localhost: %d", port);
});



