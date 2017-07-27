
const HOME_PAGE = "/#!/home";
const LOGIN_PAGE = "/#!/login"

module.exports = function (app, db, passport) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var Divespots = require("./api/divespots.controller.js")(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);

    /* 
        AUTH ROUTES
    */

    // test whether user is auth, inserts isAuth middleware
    app.get('/user/auth', isAuthenticated, function(req, res){
        res.status(200).send('true');
    });

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
        if (req.isAuthenticated())
            return next();
        res.redirect(LOGIN_PAGE);
    }

    //prep
    app.post("/api/divespots", Divespots.create);
    app.get("/api/divespots", Divespots.prep_display);

}