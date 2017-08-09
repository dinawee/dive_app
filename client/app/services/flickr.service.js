(function () {
    angular
        .module("MyApp")
        .service("FlickrSvc", FlickrSvc);

    FlickrSvc.$inject = ["$http"]

    function FlickrSvc($http) {
        var svc = this;

        svc.getFlickr = function (tag) {
            var tags = tag + " , diving" ;
            console.log("FlickrSvc : getFlickr");
            return $http.get("/api/flickr", {
                params: {
                    tags: tags,
                }
            })
                .then(function (result) {
                    return result;
                })
                .catch(function (err) {
                    console.log("Error from FlickrSvc : getFlickr: \n", err);
                })
        };

    }//End FlickrSvc
})();