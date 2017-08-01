function getAll(db) {
    return function (req, res) {
        console.log('Req user is ' + req.user.user_id);
        db.Bookmarks
            .findAll({
                where : { user_id: req.user.user_id },
                order: ['user_id'],
                // include: [ db.DiveOperators ], 
                // include fetches back the DiveOperator result, eager loading
            }
            )// returns array of JSON
            .then(function (bookmarkList) {
                console.log('Server side result is ' + JSON.stringify(bookmarkList));
                res.status(200).json(bookmarkList);
            })
            .catch(function (err) {
                console.log("Err clause: " + err);
                res.status(500).json(err);
            });
    }
}// close getAll

function createOne(db) {
    return function (req, res) {
        console.log('Req body is ' + req.body.fb_id);
        db.DiveOperators
            .findOne({
                where: { fb_id: req.body.fb_id }
                // make you pass this over 
            }).then(function (operator) {
                return db.Bookmarks
                    .create({
                        user_id: req.user.user_id, // taken from session 
                        dive_operator_id: operator.id, // taken from return
                    })
            }).then(function (newRecord) {
                console.log("new r is " + JSON.stringify(newRecord));
                res.status(200).json(newRecord);
            }).catch(function (err) {
                console.log(err);
                res.status(500).json(err);
            });
    }
}// close createOne


module.exports = function (db) {
    return {
        index: getAll(db),
        create: createOne(db)
    }
};