

/*
* Spare code for defined searches
*
**********************

Hard coded limits
var where = {
    [searchby]: [
        { undefined1: { $like: undefined1 } },
        { undefined2: { $like: undefined2 } }
    ]
}

var limit = 25;

function getAll(db) {
    return function (req, res) {
        db.DiveOperators
            .findAll({
                // where: where,
                limit: limit,
                order: ['id']
            }
            )// returns array of JSON
            .then(function (operatorList) {
                console.log("Results >>> " + JSON.stringify(operatorList));
                res.status(200).json(operatorList);
            })
            .catch(function (err) {
                console.log("Err clause: " + err);
                res.status(500).json(err);
            });
    }
}// close getAll


module.exports = function (db) {
    return {
        index: getAll(db),
        // create: postOne(db),
    }
};

*/