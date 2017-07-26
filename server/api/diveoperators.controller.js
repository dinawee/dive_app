
function getAll(db) {
    return function (req, res) {
        db.DiveOperators
            .findAll({
                // limit: 25,
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
    }
};