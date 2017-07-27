
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
    }, authCallbackFunction)
    );

    // handles the result from FB - returns null & user

    function authCallbackFunction(accessToken, refreshToken, profile, callback) {
        console.log("Returned profile is --->" + profile);
        console.log("Stringify returned profile is --->" + JSON.stringify(profile));
        console.log("Access Token is --->" + accessToken);

        var fb_id = profile.id;
        // var first_name = profile.first_name;
        // var last_name = profile.last_name;
        var email = 'random@one.com' || profile.emails[0].value;
        var access_token = accessToken;

        // i'm worried that some of the fields will be UNDEFINED and get inserted
        // obviously this won't update access token lol
        // double check the .spread documentation

        // See: 
        // https://www.youtube.com/watch?v=OMcWgmkMpEE
        // https://stackoverflow.com/questions/43403084/how-to-use-findorcreate-in-sequelize
        db.Users
            .findOrCreate({
                where: { fb_id: fb_id },
                defaults: {
                    fb_id: fb_id,
                    email: email,
                    // first_name: first_name,
                    // last_name: last_name,
                    access_token: access_token
                }
            }
            )
            .spread(function (user, created) {
                console.log(user.get({ plain: true }));
                console.log(created);
                callback(null, user);
            }); // end spread
    }

    // passport step 1 - serialize 
    passport.serializeUser(function (user, callback) {
        console.log('Serialize session');
        callback(null, user);
    });

    // passport step 2 - de-serialize - constructs req.user
    passport.deserializeUser(function (user, callback) {
        // cater for scenario when DB was down when authenticate was called 
        // so double check that user account was there
        db.Users.findOne({
            where: {
                fb_id: user.fb_id,
            }
        }).then(function (result) {
            if (result) {
                callback(null, user);
            }
        }).catch(function (err) {
            done(err, user);
        });
    });


}// close exports 