
// getting path to config file
var fs = require('fs');

var configPath = function () {
    try {
        fs.accessSync(__dirname + "/../prep/fb_data/config/development-cloud.js");
        return (__dirname + "/../prep/fb_data/config/development-cloud.js");
    } catch (e) {
        return (__dirname + "/../prep/map/config/development-cloud.js");
    }
}

/*
    CONFIG 
*/

const FacebookStrategy = require('passport-facebook');
const config = require(configPath());
// const Users = require('./db.js').Users; 
// we dont require Users table here - we req in app.js, hence say db.Users


module.exports = function (app, db, passport) {

    /* FB Strategy
        Create a new instance of FB strategy based on passport-facebook
        Supply the callback function to process the return from FB
        FB returns 1) accessToken, 2) refreshToken (optional), 3) profile (user FB data)
        4) another callback fx to complete the auth - commonaly called 'done'

    */


    passport.use(new FacebookStrategy({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        callbackURL: config.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email'] // need this line to return what fields you need
    }, authCallbackFunction)
    );

    // handles the result from FB - returns null & user
    function authCallbackFunction(accessToken, refreshToken, profile, callback) {
        // console.log("\nStringify returned profile is --->" + JSON.stringify(profile));
        console.log("\nAccess Token is --->" + accessToken);

        // note that the JSON return is structured different fr request profile fields
        // FB will return raw json as well

        var user = {
            fb_id: profile.id,
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            access_token: accessToken
        }

        db.Users
            .upsert(user)
            .then(function (result) {
                console.log("\n The result of upsert is in next line >>>>>"); //returns a boolean
                console.log(result); //returns a boolean
                callback(null, user); //return the memory object, not DB object
            })
            .catch(function (err) {
                callback(err);
                console.log(err);
            });
        // uncaught errors
    }

    // passport step 1 - serialize - creates session object 
    // stores more things than the default, including access token
    passport.serializeUser(function (user, callback) {
        console.log('\n\nSerializing session');
        console.log('\npassport.serializeUser: ' + JSON.stringify(user));
        var sessionUser = {
            fb_id: user.fb_id,
            first_name: user.first_name,
            last_name: user.last_name,
            access_token: user.access_token
        }
        callback(null, sessionUser);
    });

    // passport step 2 - de-serialize - constructs req.user
    // fires EVERY time the server is called with the matching session ID
    passport.deserializeUser(function (sessionUser, callback) {
        console.log('\n>>>>passport.deserializeUser: ' + JSON.stringify(sessionUser));
        callback(null, sessionUser);
    });


}// close exports 