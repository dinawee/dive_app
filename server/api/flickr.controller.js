var rp = require("request-promise");
var config = require("../../prep/map/config");
var uri = "https://api.flickr.com/services/rest/";

var get = function (req, res) {
    console.log("Hello flickr from controller");

    var tag = req.query.tags;

    console.log(tag);

    var options = {
        uri: uri,
        qs: {
            method: "flickr.photos.search",
            api_key: config.FLICKR_API_KEY,
            tags: tag,
            tag_mode: "all",
            content_type: 1,
            format: "json",
            nojsoncallback: 1
        },
        json: true,
    };

    rp(options)
        .then(function (results) {
            console.log(results.photos);
            res.status(200).json(results.photos);
        })
        .catch(function (err) {
            console.log(err);
        })
};

module.exports = {
    get: get,
}
