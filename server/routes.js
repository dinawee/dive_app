
const HOME_PAGE = "/#!/home";
const LOGIN_PAGE = "/#!/login";

/*
    Mailgun config
*/
// change within the exports too 
var api_key = 'key-0c8a411dfce0443d872fa6684e4241d0';
var domain = 'sandbox2636603ac88c4b3d9a8bb7cbd14a4559.mailgun.org';



// Exported modules
module.exports = function (app, db, passport) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var Divespots = require("./api/divespots.controller.js")(db);
    var DiveRegions = require("./api/diveregions.controller.js")(db);
    var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });


    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);


    /* 
        EMAIL ROUTES
    */
    app.post('/user/email', isUserAuth, function (req, res) {
        var emailObject = req.body;
        emailObject.to = req.user.email;
        emailObject.from = 'me@samples.mailgun.org';

        console.log("The email object is " + JSON.stringify(emailObject));

        mailgun.messages().send(emailObject, function (error, body) {
            console.log(body);
        });
    });

    /* 
        AUTH ROUTES
    */

    // test whether user is auth, inserts isAuth middleware
    app.get('/user/auth', isUserAuth, function (req, res) {
        res.status(200).send(req.user.access_token);
    });

    app.get('/logout', function (req, res) {
        req.logout();
        console.log('Logged out, client re-directs to home page');
        res.redirect('/');
    })


    // passport.authenticate calls the passport.use(new FacebookStrategy()) in the auth.js
    app.get('/oauth/facebook', passport.authenticate('facebook', {
        scope: ["email", "public_profile"]
    }
    ));

    app.get("/oauth/facebook/callback", passport.authenticate("facebook", {
        successRedirect: HOME_PAGE,
        failureRedirect: LOGIN_PAGE,
        failureFlash: true
    }
    ));

    // middleware to test auth
    function isUserAuth (req, res, next) {
        if (req.isAuthenticated()) {
            console.log('\n >>>> User is auth');
            next();
        }else{
            console.log('\n >>>> Re-directing');
            res.status(401).send('Unauthorized');
        }
    }
   
   
    //prep
    app.post("/api/divespots", Divespots.create);
    app.get("/api/divespots", Divespots.prep_display);
    app.post("/api/diveregions", DiveRegions.create);
    app.get("/api/diveregions", DiveRegions.prep_display);

}