(function () {
    angular
        .module("MyApp")
        .controller("MapCtrl", MapCtrl);

    MapCtrl.$inject = ["dbRouteService", "MapSvc"];

    function MapCtrl(dbRouteService, MapSvc) {
        var vm = this;

        function retrieveDiveOperators() {
            dbRouteService
                .retrieveDiveOperators()
                .then(function (results) {
                    vm.results = results;
                    createMarker();
                })
                .catch(function (err) {
                    console.log("Error: \n" + (err));
                })
        };
        retrieveDiveOperators();

        //Setting up Map variables
        var mapName = "map";
        const map = MapSvc.initMap(mapName);

        var createMarker = function () {
            for (var i in vm.results) {
                MapSvc
                    .createMarker(vm.results[i]);
            };
        }

        vm.displayDivespots = function () {
            dbRouteService
                .displayDivespots()
                .then(function (results) {
                    console.log("displayDivespots successful");
                    vm.retrievedDivespots = results.data;
                    plotDivespotsOnMap();
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                });
        }

    };//End MapCtrl

})();