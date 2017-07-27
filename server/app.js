// normal express 
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

// auth dependencies
const cookieParser = require('cookie-parser');
const session = require('express-session'); // for sessions
const passport = require('passport'); // by Jared Hanson
const flash = require('connect-flash'); // by Jared Hason too, guess passport needs this

/*
    CONFIG
*/

var app = express();
var db = require('./db.js');

var port = 3000;

const CLIENT_FOLDER = path.join(__dirname, '/../client');

/*
    EXPRESS APP
*/

// filters for passport
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// init session & passport - and they call it lightweight...
app.use(session({
  secret: 'mysecret456',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


// normal routes
app.use(express.static(CLIENT_FOLDER));
app.use(bodyParser.json());

// list api
require('./auth.js')(app, passport);
require('./routes.js')(app, db, passport);


app.listen(port, function(){
    console.log("Server now running on localhost: %d", port);
});



