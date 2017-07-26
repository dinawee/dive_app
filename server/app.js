const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');

// load express and db etc.
var app = express();
var db = require('./db.js');

var port = 3000;


const CLIENT_FOLDER = path.join(__dirname, '/../client');

// passport routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'mysecret456',
  resave: true,
  saveUninitialized: true,
}));

// start passport
app.use(passport.initialize());
app.use(passport.session());

// require('./auth.js')(app, passport); 

// normal routes
app.use(express.static(CLIENT_FOLDER));
app.use(bodyParser.json());

// list api
require('./routes.js')(app, db);


app.listen(port, function(){
    console.log("Server now running on localhost: %d", port);
});



