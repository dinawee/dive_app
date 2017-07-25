// change token when expire
var aToken = "EAACEdEose0cBAHouk6hZBf9jNtf7vI4LmiMo1QzLDGvm05RvZCmEWNCbwWzlxTZCpyV71M4JQBZBi3TdFPD5J992yxWZA53L4Gfp2P2jqOILgMSUNnOGLLAYlh2JfsMZCeAnG08DRHnjoby6GqG9BUahiIcmuwcNZCo52z3FfvFtZB3gprZCEupnnt3eZBRbdSTtIZD";

var array = ['me', 'search']

module.exports = function(app, rp) {
    for (var i in array) {
        var searchType = array[i]
        console.log(`Creating route /v2.9/${searchType}`);
        callFacebook(app, rp, searchType); 
    }
}

function callFacebook (app, rp, searchType) {
    return app.get(`/v2.9/${searchType}`, function(req, res) {
        var searchTerm = req.query.name || "";

        rp({
            method: 'GET',
            uri: `https://graph.facebook.com/v2.9/${searchType}`,
            qs: {
                access_token: aToken,
                q: searchTerm,
                type: 'page',
                fields: 'id, name, birthday'
            }
        }
        )
        // fb returns a JSON string - use JSON.parse to convert back to JSON
        .then(function(result){
            console.log(`Query successful to https://graph.facebook.com/v2.9/${searchType}`);
            res.json(JSON.parse(result));
        })
        .catch(function(err) {
            console.log(err);
        });
    });
}

