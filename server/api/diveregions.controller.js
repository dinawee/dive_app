//Prep
var create = function (db) {
    return function (req, res) {
        console.log("reached regions db");
        console.log("region_array: \n" + JSON.stringify(req.body.region.region_array));
        console.log("region_name:" + req.body.region.region_name);

        db.prep_DiveRegions
            .create({
                region_name: req.body.region.region_name,
                region_array: JSON.stringify(req.body.region.region_array),
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

        db.prep_DiveRegions
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