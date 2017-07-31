
const HOME_PAGE = "/#!/home";
const LOGIN_PAGE = "/#!/login"

module.exports = function (app, db, passport) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var Divespots = require("./api/divespots.controller.js")(db);
    var DiveRegions = require("./api/diveregions.controller.js")(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);



    /* 
        AUTH ROUTES
    */

    // test whether user is auth, inserts isAuth middleware
    app.get('/user/auth', function(req, res){
        if (req.user){
            // console.log('\n\n\n Req.user.access_token is ---> ' + req.user.access_token);
            res.status(200).send(req.user.access_token);
        } else {
            res.status(401).send('false');// need this to throw error on client side
        }
    });

    app.get('/logout', function(req, res){
        req.logout();
        console.log('Logged out, client re-directs to home page');
        res.redirect('/');
    })




    // passport.authenticate calls the passport.use(new FacebookStrategy()) in the auth.js
    app.get('/oauth/facebook', passport.authenticate('facebook',{
        scope: ["email", "public_profile"]
    }
    ));

    app.get("/oauth/facebook/callback", passport.authenticate("facebook", {
        successRedirect: HOME_PAGE,
        failureRedirect: LOGIN_PAGE,
        failureFlash : true
    }
    ));

    // middleware to test auth
    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next(); // no need return 
        }
        res.redirect('/');
    }

    //prep
    app.post("/api/divespots", Divespots.create);
    app.get("/api/divespots", Divespots.prep_display);
    app.post("/api/diveregions", DiveRegions.create);
    app.get("/api/diveregions", DiveRegions.prep_display);

}