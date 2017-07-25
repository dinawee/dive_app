
module.exports = function (app, db) {

    var DiveOperators = require('./api/diveoperators.controller.js')(db);

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);

}