
const HOME_PAGE = "/#!/home"

module.exports = function (app, db) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var Divespots = require("./api/divespots.controller.js")(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);

    // auth routes
    app.get('/user/auth', function(req, res){
        res.status(200).send('true');
    });

    // app.get("/oauth/facebook/callback", passport.authenticate("facebook", {
    //     successRedirect: HOME_PAGE,
    //     failureRedirect: HOME_PAGE,
    //     failureFlash : true
    // }));


    //prep
    app.post("/api/divespots", Divespots.create);
    app.get("/api/divespots", Divespots.prep_display);

}