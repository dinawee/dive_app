
module.exports = function (db) {
    return {
        index: getAll(db),
        create: createOne(db),
        destroy: destroyOne(db)
    }
};

const destroyOne = (db) => {
    return (req, res) => {
        db.DiveOperators
            .findOne({
                // corresponds to naming of routes and calling service
                where: { fb_id: req.params.fb_id }
                // implied return of db.Bookmarks
                // implied function braces
            })
            .then(operator => db.Bookmarks
                .destroy({
                    where : { 
                        $and : {
                            user_id: req.user.user_id, // taken from session 
                            dive_operator_id: operator.id, // taken from return
                        }
                    }
                })
            )
            .then(result => res.status(200).json(result))
            .catch(err => console.log(err));
    }
}





function getAll(db) {
    return function (req, res) {
        console.log('Req user is ' + req.user.user_id);
        db.Bookmarks
            .findAll({
                where: { user_id: req.user.user_id },
                attributes: ['user_dive_operator_id', 'user_id', 'dive_operator_id'],
                order: ['user_dive_operator_id'],
                include: [{ 
                    model: db.DiveOperators,
                    attributes: [ 'fb_id', 'name']
                }],
                // include eager loads the DiveOperator results
            }
            )// returns array of JSON
            .then(function (bookmarkList) {
                console.log(bookmarkList);
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

