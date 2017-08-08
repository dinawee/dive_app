(function () {
    angular
        .module("MyApp")
        .controller("CountryCtrl", CountryCtrl);


    /*CountryCtrl*/

    CountryCtrl.$inject = ["MapdbRouteSvc", "MapSvc", "MapStyleSvc"];

    function CountryCtrl(MapdbRouteSvc, MapSvc, MapStyleSvc) {
        var vm = this;

        function loadMapStyle() {
            vm.mapStyle = MapStyleSvc.loadMapStyle();
            console.log(vm.mapStyle);
        }
        loadMapStyle();

        //Setting up Map variables
        var mapName = "map_country";
        var mapOptions = {
            zoom: 5,
            center: { lat: 0.2000285, lng: 118.015776 },
            styles: vm.mapStyle,
            scrollwheel: false,
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
                    console.log("PrepCountryCtrl --> displayDiveRegions successful");
                    vm.retrievedDiveRegions = results.data;
                    plotOnMap(vm.retrievedDiveRegions);
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                });
        }
        displayDiveRegions();

    };//End CountryCtrl

})();