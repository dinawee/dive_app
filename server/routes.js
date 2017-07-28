
module.exports = function (app, db) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var Divespots = require("./api/divespots.controller.js")(db);
    var DiveRegions = require("./api/diveregions.controller.js")(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);

    //prep
    app.post("/api/divespots", Divespots.create);
    app.get("/api/divespots", Divespots.prep_display);
    app.post("/api/diveregions", DiveRegions.create);
    app.get("/api/diveregions", DiveRegions.prep_display);

}