(function () {
    angular
        .module("MyApp")
        .service("PrepdbRouteSvc", PrepdbRouteSvc);

    PrepdbRouteSvc.$inject = ["$http"];

    function PrepdbRouteSvc($http) {
        var svc = this;

        svc.createDivespot = function (divespot) {
            console.log("reached prepdbroute.svc.createDivespot");
            console.log(JSON.stringify(divespot));
            return $http.post("/api/divespots", {
                divespot: divespot
            });
        };

        svc.displayDivespots = function () {
            console.log("reached prepdbroute.svc.displayDivespots");
            return $http.get("/api/divespots");
        };

        svc.createRegion = function (region) {
            console.log("reached prepdbroute.svc.createRegion");
            console.log(JSON.stringify(region));
            return $http.post("/api/diveregions", {
                region: region
            });
        };

        svc.displayDiveRegions = function () {
            console.log("reached prepdbroute.svc.displayDiveRegions");
            return $http.get("/api/diveregions");
        };

    }//End of PrepdbRouteSvc
})();//End of IIFE