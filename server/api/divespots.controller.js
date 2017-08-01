//Prep
var create = function (db) {
    return function (req, res) {
        console.log("reached divespots db");

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

var display = function (db) {
    return function (req, res) {
        console.log("reached db");
        console.log(req.query.region_id);

        db.prep_Divespots
            .findAll({
                where: {
                    region_id : req.query.region_id
                },//end where
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
        display: display(db),
    }
};