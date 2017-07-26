//Prep
var create = function (db) {
    return function (req, res) {
        console.log("reached divespots db");
        console.log("req----> \n" + JSON.stringify(req.body.divespot.divespot_array));
        console.log("divespot_name:" + req.body.divespot.divespot_name);

        db.prep_Divespots
            .create({
                divespot_name: req.body.divespot.divespot_name,
                divespot_array: JSON.stringify(req.body.divespot.divespot_array),
            })
            .then(function (results) {
                res
                    .status(200)
                    .json(results);
            })
            .catch(function (err) {
                console.log(err);
                res
                    .status(500)
                    .json(err);
            })
    };
};

var prep_display = function (db) {
    return function (req, res) {
        console.log("reached db");

        db.prep_Divespots
            .findAll({
                where: {},//end where
            })
            .then(function (results) {
                res
                    .status(200)
                    .json(results);
            })
            .catch(function (err) {
                res
                    .status(500)
                    .json(err);
            })
    };
};

//Live
var display = function (db) {
    return function (req, res) {
        console.log("reached db");

        db.Divespots
            .findAll({
                where: {},//end where
            })
            .then(function (results) {
                res
                    .status(200)
                    .json(results);
            })
            .catch(function (err) {
                res
                    .status(500)
                    .json(err);
            })
    };
};

//END of divespots controller

module.exports = function (db) {
    return {
        create: create(db),
        prep_display: prep_display(db),
    }
};