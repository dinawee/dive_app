
module.exports = function (app, db) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var Divespots = require("./api/divespots.controller.js")(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);

    //prep
    app.post("/api/divespots", Divespots.create);
    app.get("/api/divespots", Divespots.prep_display);

}