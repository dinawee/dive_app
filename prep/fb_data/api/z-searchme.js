// change token when expire
var aToken = "EAACEdEose0cBAHouk6hZBf9jNtf7vI4LmiMo1QzLDGvm05RvZCmEWNCbwWzlxTZCpyV71M4JQBZBi3TdFPD5J992yxWZA53L4Gfp2P2jqOILgMSUNnOGLLAYlh2JfsMZCeAnG08DRHnjoby6GqG9BUahiIcmuwcNZCo52z3FfvFtZB3gprZCEupnnt3eZBRbdSTtIZD";


module.exports = function(app, rp) {
    app.get(`/v2.9/me`, function(req, res) {
        var searchTerm = req.query.name || "";
        rp({
            method: 'GET',
            uri: `https://graph.facebook.com/v2.9/me`,
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
            console.log(`Query successful to https://graph.facebook.com/v2.9/me`);
            res.json(JSON.parse(result));
        })
        .catch(function(err) {
            console.log(err);
        });
    });
};

