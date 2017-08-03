(function () {
    angular
        .module("MyApp")
        .service("MapdbRouteSvc", MapdbRouteSvc);

    MapdbRouteSvc.$inject = ["$http"];

    function MapdbRouteSvc($http) {
        var svc = this;

        svc.retrieveDiveOperators = function () {
            console.log("reached mapdbroute.svc.retrieveDiveOperators");
            return $http.get("/api/diveoperators");
        };

        svc.displayDivespots = function (region_id) {
            console.log("reached mapdbroute.svc.displayDivespots");
            return $http.get("/api/divespots", {
                params: {
                    region_id: region_id
                }
            })
        };

        svc.displayDiveRegions = function () {
            console.log("reached mapdbroute.svc.displayDiveRegions");
            return $http.get("/api/diveregions");
        };

    }//End of MapdbRouteSvc
})();//End of IIFE