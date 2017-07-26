(function () {
    angular
        .module("MyApp")
        .service("PrepdbRouteSvc", PrepdbRouteSvc);

    PrepdbRouteSvc.$inject = ["$http"];

    function PrepdbRouteSvc($http) {
        var svc = this;

        svc.retrieveDiveOperators = function () {
            console.log("reached prepdbroute.svc.display");
            return $http.get("/api/diveoperators");
        };

        
        svc.createDivespot = function (divespot) {
            console.log("reached prepdbroute.svc.create");
            console.log(JSON.stringify(divespot));
            return $http.post("/api/divespots", {
                divespot: divespot
            });
        };


        svc.displayDivespots = function () {
          console.log("reached prepdbroute.svc.displayDivespots");
          return $http.get("/api/divespots");  
        };

    }//End PrepdbRouteSvc
})();