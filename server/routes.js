
const HOME_PAGE = "/#!/home"

module.exports = function (app, db) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);

    app.get('/user/auth', function(req, res){
        res.status(200).send('true');
    });

    // app.get("/oauth/facebook/callback", passport.authenticate("facebook", {
    //     successRedirect: HOME_PAGE,
    //     failureRedirect: HOME_PAGE,
    //     failureFlash : true
    // }));




}