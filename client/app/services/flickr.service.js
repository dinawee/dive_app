(function () {
    angular
        .module("MyApp")
        .service("FlickrSvc", FlickrSvc);

    FlickrSvc.$inject = ["$http"]

    function FlickrSvc($http) {
        var svc = this;

        var location = "indonesia";

        svc.loadPictures = function () {
            console.log("at svc.loadPictures");
            return $http.get("https://www.flickr.com/services/rest/", {
                params: {
                    method: "flickr.photos.search",
                    api_key: "33f2538940e8902d3623cdf718de31f1",
                    tags: "diving", location,
                    content_type: 1,
                    per_page: 9,
                    format: "json",
                    nojsoncallback: 1
                }
            });
        }

    }//End FlickrSvc

})();