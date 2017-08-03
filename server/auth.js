
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
            }).then(function(){
                return db.Users.findOne(
                    { where: {fb_id: user.fb_id } }
                ) // multiple return in a promise? 
            }).then(function(dbUser){
                console.log("The user record is " + JSON.stringify(dbUser));
                callback(null, dbUser); 
            })
            .catch(function (err) {
                callback(err);
                console.log(err);
            });
    }

    // passport step 1 - serialize - creates session object 
    // stores more things than the default, including access token
    passport.serializeUser(function (sessionUser, callback) {
        console.log('\n\nSerializing session');
        console.log('\npassport.serializeUser: ' + JSON.stringify(sessionUser));
        callback(null, sessionUser); 
        // note we create the sessionUser with the entire user object
        // memory implications? 
    });

    // passport step 2 - de-serialize - constructs req.user
    // fires EVERY time the server is called with the matching session ID
    passport.deserializeUser(function (sessionUser, callback) {
        console.log('\n>>>>passport.deserializeUser: ' + JSON.stringify(sessionUser));
        callback(null, sessionUser);
    });


}// close exports 


// DONE. 0. do a DB find by fb_id and return user id 
// DONE. 1. Update server/auth.js to store id when serialize user object - req.user.id 
// DONE 2. New end point POST /api/bookmarks - call out req.user.id
// DONE 3. New controller bookmarks.controller.js - note that since the models are exported
    // you still can call DiveOperators findBy (fb_id) - call out DiveOperators Id
    // return Bookmarks.create using DiveOperators Id and User Id


// 4. New end point GET api/bookmarks - call out req.user.id
// 5. Add on the bookmarks.controller = findAll - no limit 
    // return entire list as JSON - list them as a table 
    // KIV fire AJAX calls for the entire list to return from FB
