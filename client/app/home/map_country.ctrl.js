(function () {
    angular
        .module("MyApp")
        .controller("MapCtrl", MapCtrl);

    MapCtrl.$inject = ["MapdbRouteSvc", "MapSvc"];

    function MapCtrl(MapdbRouteSvc, MapSvc) {
        var vm = this;

        //Setting up Map variables
        var mapName = "map_country";
        var mapOptions = {
            zoom: 5,
            center: { lat: 0.2000285, lng: 118.015776 }
        }
        const map = MapSvc.initMap(mapName, mapOptions);

        var plotOnMap = function (retrievedResults) {
            for (var i in retrievedResults) {
                MapSvc
                    .createPoly(retrievedResults[i]);
            }
        };

        function displayDiveRegions() {
            MapdbRouteSvc
                .displayDiveRegions()
                .then(function (results) {
                    console.log("PrepMapCtrl --> displayDiveRegions successful");
                    vm.retrievedDiveRegions = results.data;
                    console.log(vm.retrievedDiveRegions[0].region_array);
                    plotOnMap(vm.retrievedDiveRegions);
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                });
        }
        displayDiveRegions();

    };//End MapCtrl

})();