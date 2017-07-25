// i uds that app.get is being RUN here 
// but i assumeed that it wld just create a listener, 
// instead the callback fires instantly

const rp = require('request-promise');


module.exports = function (app, db) {

    // var list = require('../api/rawresults.json');

    var DiveOperators = require('./api/diveoperators.controller.js')(db);
    var API = require('./api/searchplaces');

    // Index GET all
    app.get('/api/diveoperators', DiveOperators.index);

    // Create POST one - not created
    // app.post('/api/diveoperators', DiveOperators.create)


    
    /*
    API side code 
    */

    // GET '/v2.9/search'
    app.get(`/v2.9/search`, function (req, res) {
        var searchTerm = req.query.name || "diving indonesia"; // else diving
        return API.callFb(rp, searchTerm)
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err) {
                res.send(err);
                console.log('We got an error');
            });
    });

}