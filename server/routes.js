
module.exports = function (app, db) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var Divespots = require("./api/divespots.controller.js")(db);
    var DiveRegions = require("./api/diveregions.controller.js")(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);
    app.get("/api/diveregions", DiveRegions.display);
    app.get("/api/divespots", Divespots.display);
    // app.get("/api/divespots", Divespots.display);

    //prep
    app.post("/api/divespots", Divespots.create);
    app.post("/api/diveregions", DiveRegions.create);

}