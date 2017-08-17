// ES6
// implied function braces when single expression (one ;) 
    // -> no in between console.logs
    // -> no in between comments
// implied return when braces omitted

// be careful when returning objects or empty objects


// changeObject is first param, sent as req.body
const updateOne = (db) => {
    return (req, res) => {db.Bookmarks
        .update(
            req.body, 
            { where: { user_dive_operator_id : req.params.id} }
        ).then(result => res.status(200).json(result) 
        ).catch(err => res.status(500).json(err));
    }
}

const destroyOne = (db) => {
    return (req, res) => {db.Bookmarks
        .destroy(
            { where: { user_dive_operator_id : req.params.id} }
        ).then(result => res.status(200).json(result)
        ).catch(err => res.status(500).json(err));
    }
}


function getAll(db) {
    return function (req, res) {
        console.log('Req user is ' + req.user.user_id);
        db.Bookmarks
            .findAll({
                where: { user_id: req.user.user_id },
                attributes: ['user_dive_operator_id', 'user_id', 'dive_operator_id', 'comment', 'is_visited'],
                order: ['user_dive_operator_id'],
                include: [{
                    model: db.DiveOperators,
                    attributes: ['fb_id', 'name']
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
                        is_visited: false // cannot leave blank 
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
        create: createOne(db),
        destroy: destroyOne(db),
        update: updateOne(db)
    }
};

/* Old functions when bookmarks id not directly available

const destroyOne = (db) => {
    return (req, res) => {
        db.DiveOperators
            .findOne({
                where: { fb_id: req.params.fb_id }
            })
            .then(operator => db.Bookmarks
                .destroy({
                    where: {
                        $and: {
                            user_id: req.user.user_id, // taken from session 
                            dive_operator_id: operator.id, // taken from return
                        }
                    }
                })
            )
            .then(result => res.status(200).json(result))
            .catch(err => res.status(500).json(err));
    }
}

const updateOne = (db) => {
    return (req, res) => {
        db.DiveOperators
            .findOne({
                where: { fb_id: req.params.fb_id }
            }).then(operator =>
                db.Bookmarks.find({
                    where: {
                        $and: {
                            user_id: req.user.user_id, // taken from session 
                            dive_operator_id: operator.id, // taken from return
                        }
                    }
                })
            ).then(bookmark => bookmark.updateAttributes(req.body)
            ).then(result => res.status(200).json(result)
            ).catch(err => res.status(500).json(err));
    }
}

*/